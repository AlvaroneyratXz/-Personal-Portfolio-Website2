-- Cuenta interna del administrador: la contraseña vive solo en la base de datos (cifrada), nunca en el código de la página.
create extension if not exists pgcrypto with schema extensions;

do $$
declare
  nuevo_id uuid := gen_random_uuid();
  correo_admin text := 'administrador@portafolio-admin.com';
begin
  if not exists (select 1 from auth.users where email = correo_admin) then
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', nuevo_id, 'authenticated', 'authenticated', correo_admin,
      extensions.crypt(')24o4ENg-RBA', extensions.gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}', '{}', now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values (
      gen_random_uuid(), nuevo_id, nuevo_id::text,
      jsonb_build_object('sub', nuevo_id::text, 'email', correo_admin, 'email_verified', true),
      'email', now(), now(), now()
    );
  end if;

  -- Asegura que esta cuenta tenga el rol de administrador.
  insert into public.user_roles (user_id, role)
  select id, 'admin' from auth.users where email = correo_admin
  on conflict (user_id, role) do nothing;
end;
$$;
