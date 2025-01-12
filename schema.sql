/** 
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  -- UUID from auth.users
  id uuid references auth.users(id) not null primary key,
  name text,
  email text,
  email_verified timestamp with time zone,
  image text,
  created_at timestamp with time zone, 
  updated_at timestamp with time zone,
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  stripe_current_period_end timestamp with time zone
);
alter table users add constraint unique_email unique (email);
alter table users add constraint unique_stripe_customer_id unique (stripe_customer_id);
alter table users add constraint unique_stripe_subscription_id unique (stripe_subscription_id);
alter table users enable row level security;
create policy "Users can view own user data." on users for select using (auth.uid() = id);
create policy "Users can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.users (id, email, name, image, created_at)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.created_at);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 

create function public.update_public_user_info()
returns trigger as $$
begin
  update public.users 
  set email_verified = new.email_confirmed_at, updated_at = new.updated_at, name = new.raw_user_meta_data->>'full_name'
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_updated
  after update on auth.users
  for each row execute procedure public.update_public_user_info();

/**
* POSTS
* Note: this is a private table that contains a mapping of user IDs to author IDs.
*/

create table posts (
  id uuid default uuid_generate_v4() not null primary key,
  title text not null,
  content jsonb,
  published boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  author_id uuid references public.users(id) not null
);
alter table posts enable row level security;
create policy "Anyone can read posts." on posts for select using (true);
create policy "Authorized users can insert posts." on posts for insert to authenticated with check (true);
create policy "Users update own posts." on posts for update using (auth.uid() = author_id);
create policy "Users delete own posts." on posts for delete using (auth.uid() = author_id);
