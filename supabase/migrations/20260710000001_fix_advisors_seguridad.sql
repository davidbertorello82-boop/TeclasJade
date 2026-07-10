-- Corrige 2 avisos de seguridad detectados por el linter de Supabase luego
-- de la migracion anterior.

-- 1) check_bloque_pertenece_a_pilar tenia el search_path mutable.
create or replace function public.check_bloque_pertenece_a_pilar()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  bloque_pilar_id uuid;
begin
  select pilar_id into bloque_pilar_id
  from public.bloques
  where id = new.bloque_actual_id;

  if bloque_pilar_id is distinct from new.pilar_id then
    raise exception 'bloque_actual_id (%) no pertenece al pilar_id (%)', new.bloque_actual_id, new.pilar_id;
  end if;

  return new;
end;
$$;

-- 2) handle_new_user es SECURITY DEFINER y quedaba invocable directo via
-- /rest/v1/rpc/handle_new_user por anon/authenticated. Solo debe dispararse
-- desde el trigger de auth.users, nunca llamado a mano.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
