-- Function to automatically update modified_at column on update
create or replace function update_modified_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language 'plpgsql';

-- Scaffold departments table
create table public.departments (
  id uuid not null default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create trigger update_departments_modtime
before update on departments
for each row execute function update_modified_column();

-- Scaffold users table
create table public.users (
  id uuid not null default uuid_generate_v4() primary key,
  auth_id uuid references auth.users,
  name text,
  department_id uuid references public.departments on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create trigger update_users_modtime
before update on users
for each row execute function update_modified_column();

-- Function to insert user profile on auth user created
create or replace function public.handle_create_user()
returns trigger as $$
begin
  insert into public.users (auth_id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to handle auth user creation
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_create_user();

-- Scaffold sessions table
create table public.sessions (
  id uuid not null default uuid_generate_v4() primary key,
  author_id uuid not null references public.users on delete cascade,
  starts_at timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create trigger update_sessions_modtime
before update on sessions
for each row execute function update_modified_column();

-- Scaffold participants table
create table public.participants (
  session_id uuid not null references public.sessions on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  position integer not null default 1,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (session_id, user_id)
);

create trigger update_participants_modtime
before update on participants
for each row execute function update_modified_column();
