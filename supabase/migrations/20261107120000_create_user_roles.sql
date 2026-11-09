-- Roles de usuario para proteger el panel de administrador con autenticación real.
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Cada usuario solo puede ver sus propios roles. Nadie puede insertar, editar ni borrar desde el navegador.
create policy "Los usuarios ven sus propios roles"
  on public.user_roles
  for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;

-- La primera cuenta que se registre será administradora; las demás quedan sin permisos de administrador.
create or replace function public.asignar_rol_inicial()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

revoke execute on function public.asignar_rol_inicial() from public, anon, authenticated;

create trigger asignar_rol_inicial_al_registrarse
  after insert on auth.users
  for each row execute function public.asignar_rol_inicial();
