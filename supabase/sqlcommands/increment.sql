create or replace function increment_data_sources_counter(bot_id uuid)
returns void as $$
begin
  update chatbot
  set "data_sources_counter" = "data_sources_counter" + 1
  where id = bot_id;
end;
$$ language plpgsql;
