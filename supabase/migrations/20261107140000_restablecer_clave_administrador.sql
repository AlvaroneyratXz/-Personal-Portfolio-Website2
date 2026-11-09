-- Deja la cuenta interna del administrador lista y con la contraseña indicada (solo en la base de datos, cifrada).
update auth.users
set
  encrypted_password = extensions.crypt(')24o4ENg-RBA', extensions.gen_salt('bf')),
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  confirmation_token = coalesce(confirmation_token, ''),
  recovery_token = coalesce(recovery_token, ''),
  email_change_token_new = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  email_change = coalesce(email_change, ''),
  phone_change = coalesce(phone_change, ''),
  phone_change_token = coalesce(phone_change_token, ''),
  reauthentication_token = coalesce(reauthentication_token, ''),
  updated_at = now()
where email = 'administrador@portafolio-admin.com';

insert into public.user_roles (user_id, role)
select id, 'admin' from auth.users where email = 'administrador@portafolio-admin.com'
on conflict (user_id, role) do nothing;
