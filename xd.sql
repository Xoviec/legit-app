-- drop table users;
create table users (
  id uuid references auth.users not null primary key,
  email text,
  nickname text,
  account_type text default 'user',
  avatar text default null,
  items_list jsonb[] default '{}'::jsonb[],
  is_verified boolean default false


);

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  INSERT INTO public.users (id, email, nickname)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) 
  DO 
    UPDATE SET email = new.email;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after update or insert on auth.users
  for each row execute procedure public.handle_new_user()