-- Supabase AI is experimental and may produce incorrect answers
-- Always verify the output before executing

begin;

create table
  chatbot (
    id uuid primary key default gen_random_uuid (),
    user_id uuid references users (id),
    settings JSONB default '{"showCot": true, "headerText": "Chatbot", "theme": "light", "fontFamily": "Inter, sans-serif", "button": {"style": {"bgcolor": "#007BFF", "bgcolorHover": "#659492"}}}',
    uiSettings JSONB default '{"light": {"background": "#FFFFFF", "paper": "#FFFFFF", "primary": {"main": "#007BFF", "dark": "#980039", "light": "#FFE7EB"}}, "dark": {"background": "#15181b", "paper": "#FFFFFF", "primary": {"main": "#007BFF", "dark": "#980039", "light": "#FFE7EB"}}}'
  );

alter table chatbot enable row level security;

create policy "Can view own chatbots" on chatbot for
select
  using (auth.uid () = user_id);

create policy "Can insert own chatbots" on chatbot for insert
with
  check (auth.uid () = user_id);

create policy "Can update own chatbots" on chatbot
for update
  using (auth.uid () = user_id);

commit;