create or replace function increment_event_participants(event_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update events
  set current_participants = current_participants + 1
  where id = event_id;
end;
$$; 