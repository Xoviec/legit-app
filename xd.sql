-- create table users (
--     id uuid references auth.users not null primary key,
--     email text,
--     nick text,
--     avatar text,
--     account_type text,
--     is_verified boolean
-- );

-- create or replace function public.handle_new_user() 
-- returns trigger as $$
-- begin
--   INSERT INTO public.users (id, email, nick, avatar, account_type, is_verified)
--   values (new.id, new.email, NEW.user_metadata->>"full_name", NULL, "user", false)
--   ON CONFLICT (id) 
--   DO 
--     UPDATE SET 
--         email = new.email,
--         nick = new.user_metadata->>"full_name",
--         avatar = null,
--         account_type = "user",
--         is_verified = false;

--   return new;
-- end;
-- $$ language plpgsql security definer;

-- drop trigger if exists on_auth_user_created on auth.users;
-- create trigger on_auth_user_created
--   after update or insert on auth.users
--   for each row execute procedure public.handle_new_user()

create table users (
  id uuid references auth.users not null primary key,
  email text,
  account_type text DEFAULT 'user',
  nickname text
);

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  INSERT INTO public.users (id, email, account_type, nickname)
  values (new.id, new.email, new.raw_user_meta_data->>"full_name")
  ON CONFLICT (id) 
  DO 
    UPDATE SET 
        email = new.email,
            
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after update or insert on auth.users
  for each row execute procedure public.handle_new_user()