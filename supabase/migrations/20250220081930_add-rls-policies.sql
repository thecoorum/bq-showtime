-- Enable RLS on departments table
alter table public.departments enable row level security;

-- Enable RLS on users table
alter table public.users enable row level security;

-- Enable RLS on sessions table
alter table public.sessions enable row level security;

-- Enable RLS on participants table
alter table public.participants enable row level security;

-- Policies for departments table
create policy "Authenticated users can select departments"
on public.departments
for select
to authenticated
using (true);

create policy "Authenticated users can insert departments"
on public.departments
for insert
to authenticated
with check (true);

create policy "Authenticated users can update departments"
on public.departments
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete departments"
on public.departments
for delete
to authenticated
using (true);

-- Policies for users table
create policy "Authenticated users can select users"
on public.users
for select
to authenticated
using (true);

create policy "Authenticated users can insert users"
on public.users
for insert
to authenticated
with check (true);

create policy "Authenticated users can update users"
on public.users
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete users"
on public.users
for delete
to authenticated
using (true);

-- Policies for sessions table
create policy "Authenticated users can select sessions"
on public.sessions
for select
to authenticated
using (true);

create policy "Authenticated users can insert sessions"
on public.sessions
for insert
to authenticated
with check (true);

create policy "Authenticated users can update sessions"
on public.sessions
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete sessions"
on public.sessions
for delete
to authenticated
using (true);

-- Policies for participants table
create policy "Authenticated users can select participants"
on public.participants
for select
to authenticated
using (true);

create policy "Authenticated users can insert participants"
on public.participants
for insert
to authenticated
with check (true);

create policy "Authenticated users can update participants"
on public.participants
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated users can delete participants"
on public.participants
for delete
to authenticated
using (true);
