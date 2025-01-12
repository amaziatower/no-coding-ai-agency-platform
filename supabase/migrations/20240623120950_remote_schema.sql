
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE SCHEMA IF NOT EXISTS "public";

ALTER SCHEMA "public" OWNER TO "pg_database_owner";

CREATE TYPE "public"."pricing_plan_interval" AS ENUM (
    'day',
    'week',
    'month',
    'year'
);

ALTER TYPE "public"."pricing_plan_interval" OWNER TO "postgres";

CREATE TYPE "public"."pricing_type" AS ENUM (
    'one_time',
    'recurring'
);

ALTER TYPE "public"."pricing_type" OWNER TO "postgres";

CREATE TYPE "public"."subscription_status" AS ENUM (
    'trialing',
    'active',
    'canceled',
    'incomplete',
    'incomplete_expired',
    'past_due',
    'unpaid',
    'paused'
);

ALTER TYPE "public"."subscription_status" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."get_analytics_data"("bot_id" "uuid") RETURNS TABLE("day" "date", "total_questions" integer)
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
  v_bot_id ALIAS FOR $1;
BEGIN
  RETURN QUERY
  SELECT 
    date_trunc('day', a.created_at)::date AS day, 
    SUM(a.questions_asked)::int AS total_questions
  FROM 
    public.analytics a
  WHERE 
    a.bot_id = v_bot_id
    AND a.created_at >= NOW() - INTERVAL '30 days'
  GROUP BY 
    date_trunc('day', a.created_at)::date
  ORDER BY 
    date_trunc('day', a.created_at)::date;
END;
$_$;

ALTER FUNCTION "public"."get_analytics_data"("bot_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increment_data_sources_counter"("bot_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$begin
  update chatbot
  set "data_sources_counter" = "data_sources_counter" + 1
  where id = bot_id;
end;$$;

ALTER FUNCTION "public"."increment_data_sources_counter"("bot_id" "uuid") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."increment_questions_counter"("chatbot_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  v_user_id UUID;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Fetch the user_id from the public.chatbot table
  SELECT user_id INTO v_user_id FROM public.chatbot WHERE id = chatbot_id;

  -- Check if a record for the same date already exists
  IF EXISTS (SELECT 1 FROM public.analytics WHERE bot_id = chatbot_id AND date = v_today) THEN
    -- Update the existing record
    UPDATE public.analytics
    SET questions_asked = questions_asked + 1,
        created_at = NOW()
    WHERE bot_id = chatbot_id AND date = v_today;
  ELSE
    -- Insert a new record
    INSERT INTO public.analytics (user_id, bot_id, questions_asked, created_at, date)
    VALUES (v_user_id, chatbot_id, 1, NOW(), v_today);
  END IF;

  -- Increment the questions_counter in the chatbot table
  UPDATE public.chatbot
  SET questions_counter = questions_counter + 1
  WHERE id = chatbot_id;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'An error occurred: %', SQLERRM;
END;
$$;

ALTER FUNCTION "public"."increment_questions_counter"("chatbot_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."analytics" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "bot_id" "uuid",
    "questions_asked" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "date" "date"
);

ALTER TABLE "public"."analytics" OWNER TO "postgres";

ALTER TABLE "public"."analytics" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."analytics_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."chatbot" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "settings" "jsonb" DEFAULT '{"theme": "light", "button": {"style": {"size": "4rem", "bgcolor": "#007BFF", "bgcolorHover": "#659492"}, "imageUrl": "Bot", "containerId": "copilot"}, "logoUrl": "https://hpogngdwousevnyrnmew.supabase.co/storage/v1/object/public/demo/logo_light.png", "showCot": true, "fontFamily": "Inter, sans-serif", "headerText": "Chatbot", "chainlitServer": "https://chatbotdashboard-2kg4j2lj7a-od.a.run.app/"}'::"jsonb",
    "botName" "text",
    "description" "text",
    "botConfig" "jsonb",
    "data_sources_limit" smallint DEFAULT '0'::smallint,
    "questions_limit" integer,
    "data_sources_counter" smallint DEFAULT '0'::smallint,
    "questions_counter" integer DEFAULT 0
);

ALTER TABLE "public"."chatbot" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" NOT NULL,
    "stripe_customer_id" "text"
);

ALTER TABLE "public"."customers" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."prices" (
    "id" "text" NOT NULL,
    "product_id" "text",
    "active" boolean,
    "description" "text",
    "unit_amount" bigint,
    "currency" "text",
    "type" "public"."pricing_type",
    "interval" "public"."pricing_plan_interval",
    "interval_count" integer,
    "trial_period_days" integer,
    "metadata" "jsonb",
    CONSTRAINT "prices_currency_check" CHECK (("char_length"("currency") = 3))
);

ALTER TABLE "public"."prices" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "text" NOT NULL,
    "active" boolean,
    "name" "text",
    "description" "text",
    "image" "text",
    "metadata" "jsonb",
    "features" "json",
    "data_sources_limit" smallint,
    "questions_limit" integer
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."questions_log" (
    "id" bigint NOT NULL,
    "bot_id" "uuid" NOT NULL,
    "change_amount" integer NOT NULL,
    "change_timestamp" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."questions_log" OWNER TO "postgres";

ALTER TABLE "public"."questions_log" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."questions_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."subscriptions" (
    "id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "status" "public"."subscription_status",
    "metadata" "jsonb",
    "price_id" "text",
    "quantity" integer,
    "cancel_at_period_end" boolean,
    "created" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "current_period_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "ended_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "cancel_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "canceled_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_start" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "trial_end" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "chatbot_limit" smallint DEFAULT '1'::smallint,
    "data_sources_limit" smallint,
    "questions_limit" integer
);

ALTER TABLE "public"."subscriptions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "billing_address" "jsonb",
    "payment_method" "jsonb",
    "chatbot_limit" smallint DEFAULT '0'::smallint NOT NULL,
    "secret_key" "text"
);

ALTER TABLE "public"."users" OWNER TO "postgres";

ALTER TABLE ONLY "public"."analytics"
    ADD CONSTRAINT "analytics_pkey" PRIMARY KEY ("id", "created_at");

ALTER TABLE ONLY "public"."chatbot"
    ADD CONSTRAINT "chatbot_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."questions_log"
    ADD CONSTRAINT "questions_log_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_secret_api_key_key" UNIQUE ("secret_key");

CREATE INDEX "analytics_created_at_idx" ON "public"."analytics" USING "btree" ("created_at" DESC);

CREATE UNIQUE INDEX "analytics_user_bot_created_at_idx" ON "public"."analytics" USING "btree" ("user_id", "bot_id", "created_at");

CREATE INDEX "chatbot_id_idx" ON "public"."chatbot" USING "btree" ("id");

CREATE UNIQUE INDEX "unique_bot_date_created_at" ON "public"."analytics" USING "btree" ("bot_id", "date", "created_at");

CREATE INDEX "users_id_idx" ON "public"."users" USING "btree" ("id");

CREATE OR REPLACE TRIGGER "ts_insert_blocker" BEFORE INSERT ON "public"."analytics" FOR EACH ROW EXECUTE FUNCTION "_timescaledb_internal"."insert_blocker"();

ALTER TABLE ONLY "public"."analytics"
    ADD CONSTRAINT "analytics_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "public"."chatbot"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."analytics"
    ADD CONSTRAINT "analytics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."analytics"
    ADD CONSTRAINT "analytics_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."chatbot"
    ADD CONSTRAINT "chatbot_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "fk_customer_id" FOREIGN KEY ("id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "fk_subscription_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."chatbot"
    ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."prices"
    ADD CONSTRAINT "prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_price_id_fkey" FOREIGN KEY ("price_id") REFERENCES "public"."prices"("id");

ALTER TABLE ONLY "public"."subscriptions"
    ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;

CREATE POLICY "Allow authenticated update" ON "public"."chatbot" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Allow public read-only access." ON "public"."prices" FOR SELECT USING (true);

CREATE POLICY "Allow public read-only access." ON "public"."products" FOR SELECT USING (true);

CREATE POLICY "Can insert own chatbots" ON "public"."chatbot" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Can only view own subs data." ON "public"."subscriptions" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own chatbots" ON "public"."chatbot" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can update own user data." ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));

CREATE POLICY "Can view own chatbots" ON "public"."chatbot" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Can view own user data." ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));

CREATE POLICY "Enable delete for users based on user_id" ON "public"."chatbot" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));

CREATE POLICY "Enable insert for authenticated users only" ON "public"."customers" FOR INSERT TO "authenticated" WITH CHECK (true);

CREATE POLICY "allow unauthenticated update to questions_counter" ON "public"."chatbot" FOR UPDATE USING ((("current_setting"('request.jwt.claim.role'::"text", true) IS NULL) OR ("current_setting"('request.jwt.claim.role'::"text", true) = ''::"text"))) WITH CHECK ((("current_setting"('request.jwt.claim.role'::"text", true) IS NULL) OR ("current_setting"('request.jwt.claim.role'::"text", true) = ''::"text")));

ALTER TABLE "public"."chatbot" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "increment_questions_counter_policy" ON "public"."chatbot" TO "public_increment_role" USING (true) WITH CHECK (true);

ALTER TABLE "public"."prices" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_access_policy" ON "public"."chatbot" FOR SELECT USING (true);

ALTER TABLE "public"."subscriptions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."get_analytics_data"("bot_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_analytics_data"("bot_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_analytics_data"("bot_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."increment_data_sources_counter"("bot_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_data_sources_counter"("bot_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_data_sources_counter"("bot_id" "uuid") TO "service_role";

GRANT ALL ON FUNCTION "public"."increment_questions_counter"("chatbot_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."increment_questions_counter"("chatbot_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."increment_questions_counter"("chatbot_id" "uuid") TO "service_role";
GRANT ALL ON FUNCTION "public"."increment_questions_counter"("chatbot_id" "uuid") TO "public_increment_role";

GRANT ALL ON TABLE "public"."analytics" TO "anon";
GRANT ALL ON TABLE "public"."analytics" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics" TO "service_role";

GRANT ALL ON SEQUENCE "public"."analytics_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."analytics_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."analytics_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."chatbot" TO "anon";
GRANT ALL ON TABLE "public"."chatbot" TO "authenticated";
GRANT ALL ON TABLE "public"."chatbot" TO "service_role";
GRANT SELECT ON TABLE "public"."chatbot" TO "public_role";

GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";

GRANT ALL ON TABLE "public"."prices" TO "anon";
GRANT ALL ON TABLE "public"."prices" TO "authenticated";
GRANT ALL ON TABLE "public"."prices" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."questions_log" TO "anon";
GRANT ALL ON TABLE "public"."questions_log" TO "authenticated";
GRANT ALL ON TABLE "public"."questions_log" TO "service_role";

GRANT ALL ON SEQUENCE "public"."questions_log_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."questions_log_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."questions_log_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."subscriptions" TO "service_role";

GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
