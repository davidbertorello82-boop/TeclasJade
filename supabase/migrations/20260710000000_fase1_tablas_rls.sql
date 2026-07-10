-- Fase 1: tablas base + Row Level Security.
-- pilares y bloques son catalogo fijo (una fila por aula real / bloque real
-- del curriculum). user_progress referencia bloques.id en vez de un numero
-- suelto, para que la base rechace por diseno cualquier "bloque actual" que
-- no exista.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Catalogo: pilares (las 4 aulas)
-- ---------------------------------------------------------------------
create table public.pilares (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  tutor_nombre text not null,
  orden smallint not null unique
);

-- ---------------------------------------------------------------------
-- Catalogo: bloques (bloques reales de cada aula, cantidad variable)
-- ---------------------------------------------------------------------
create table public.bloques (
  id uuid primary key default gen_random_uuid(),
  pilar_id uuid not null references public.pilares (id) on delete cascade,
  nombre text not null,
  posicion smallint,
  es_transversal boolean not null default false,
  constraint bloques_posicion_coherente check (
    (es_transversal and posicion is null)
    or (not es_transversal and posicion is not null)
  ),
  constraint bloques_pilar_posicion_unico unique (pilar_id, posicion)
);

-- ---------------------------------------------------------------------
-- users: perfil de alumno, uno por usuario de Supabase Auth
-- ---------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text,
  profile_photo_url text,
  subscription_status text not null default 'inactive'
    check (subscription_status in ('inactive', 'active', 'cancelled', 'pending')),
  created_at timestamptz not null default now()
);

-- Crea automaticamente la fila de perfil cuando alguien se registra en Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, created_at)
  values (new.id, new.email, new.created_at);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- subscriptions: estado de pago. Se llena en la Fase 3 via webhook.
-- ---------------------------------------------------------------------
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  mercadopago_subscription_id text,
  status text not null default 'inactive'
    check (status in ('inactive', 'active', 'cancelled', 'pending')),
  next_billing_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- user_progress: progreso del alumno, una fila por (user_id, pilar).
-- ---------------------------------------------------------------------
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  pilar_id uuid not null references public.pilares (id) on delete cascade,
  bloque_actual_id uuid not null references public.bloques (id),
  ejercicios_completados jsonb not null default '[]'::jsonb,
  racha_practica integer not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, pilar_id)
);

-- Blindaje de independencia de aulas: el bloque_actual_id tiene que
-- pertenecer al mismo pilar_id de la fila. Sin esto, seria posible guardar
-- (pilar = Guitarra, bloque_actual = un bloque de Piano) por error de la app.
create function public.check_bloque_pertenece_a_pilar()
returns trigger
language plpgsql
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

create trigger trg_check_bloque_pertenece_a_pilar
  before insert or update on public.user_progress
  for each row execute function public.check_bloque_pertenece_a_pilar();

-- ---------------------------------------------------------------------
-- mensajes_ia_consumo: consumo mensual de mensajes con tutores de IA.
-- ---------------------------------------------------------------------
create table public.mensajes_ia_consumo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  mes date not null,
  mensajes_consumidos integer not null default 0,
  unique (user_id, mes)
);

-- ---------------------------------------------------------------------
-- reportes_error: reportes desde el boton "Reportar error" del chat.
-- ---------------------------------------------------------------------
create table public.reportes_error (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  tutor text not null,
  tipo_error text not null,
  contexto_json jsonb,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'revisado', 'resuelto')),
  fecha timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.pilares enable row level security;
alter table public.bloques enable row level security;
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.user_progress enable row level security;
alter table public.mensajes_ia_consumo enable row level security;
alter table public.reportes_error enable row level security;

-- Catalogo de solo lectura para cualquier usuario logueado.
create policy "pilares: lectura para logueados"
  on public.pilares for select
  to authenticated
  using (true);

create policy "bloques: lectura para logueados"
  on public.bloques for select
  to authenticated
  using (true);

-- users: cada quien lee y edita solo su propia fila.
create policy "users: leer propia fila"
  on public.users for select
  to authenticated
  using (auth.uid() = id);

create policy "users: editar propia fila"
  on public.users for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- subscriptions: cada quien SOLO puede ver su propio estado. Nadie (ni el
-- propio usuario) puede escribir esta tabla desde la app: la escritura queda
-- reservada al webhook de Mercado Pago (Fase 3), que usa la clave
-- service_role y por lo tanto no pasa por estas politicas.
create policy "subscriptions: leer propia fila"
  on public.subscriptions for select
  to authenticated
  using (auth.uid() = user_id);

-- user_progress: cada quien lee y escribe solo su propio progreso.
create policy "user_progress: leer propio progreso"
  on public.user_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_progress: crear propio progreso"
  on public.user_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_progress: actualizar propio progreso"
  on public.user_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- mensajes_ia_consumo: cada quien SOLO puede ver su propio consumo. El
-- descuento de mensajes lo hace el servidor (Fase 5) con service_role, para
-- que nadie se regale mensajes editando el navegador.
create policy "mensajes_ia_consumo: leer propio consumo"
  on public.mensajes_ia_consumo for select
  to authenticated
  using (auth.uid() = user_id);

-- reportes_error: cada quien lee y crea sus propios reportes. El cambio de
-- estado (revisado/resuelto) no tiene politica de update: queda reservado
-- a administracion via service_role.
create policy "reportes_error: leer propios reportes"
  on public.reportes_error for select
  to authenticated
  using (auth.uid() = user_id);

create policy "reportes_error: crear propio reporte"
  on public.reportes_error for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- Seed: catalogo de pilares y bloques (nombres reales de cada curriculum.md)
-- ---------------------------------------------------------------------
insert into public.pilares (slug, nombre, tutor_nombre, orden) values
  ('piano', 'Piano', 'Maestro Allegro', 1),
  ('guitarra', 'Guitarra', 'Maestro Ritmo', 2),
  ('canto', 'Canto', 'Maestra Resonancia', 3),
  ('teoria-musical', 'Teoría Musical', 'Profesor Harmónico', 4);

insert into public.bloques (pilar_id, nombre, posicion, es_transversal)
select pilares.id, b.nombre, b.posicion, false
from public.pilares, (values
  ('piano', 'Fase Semilla', 1),
  ('piano', 'Fase Conectiva / Core', 2),
  ('piano', 'Fase de Especialización Exigente', 3),
  ('piano', 'Fase de Consolidación y Práctica Profesional Avanzada', 4),
  ('piano', 'Fase de Trascendencia y Virtuosismo Absoluto', 5)
) as b(slug, nombre, posicion)
where pilares.slug = b.slug;

insert into public.bloques (pilar_id, nombre, posicion, es_transversal)
select pilares.id, b.nombre, b.posicion, false
from public.pilares, (values
  ('guitarra', 'Bloque 1 — El Despertar Psicomotriz y la Alfabetización', 1),
  ('guitarra', 'Bloque 2 — La Consolidación Mecánica y la Geometría del Mástil', 2),
  ('guitarra', 'Bloque 3 — El Espacio Funcional, la Síncopa y la Polifonía', 3),
  ('guitarra', 'Bloque 4 — La Frontera Creativa y la Maestría Profesional', 4)
) as b(slug, nombre, posicion)
where pilares.slug = b.slug;

insert into public.bloques (pilar_id, nombre, posicion, es_transversal)
select pilares.id, b.nombre, b.posicion, false
from public.pilares, (values
  ('canto', 'El Despertar Propioceptivo (Fase Semilla)', 1),
  ('canto', 'La Arquitectura del Appoggio (Fase Core)', 2),
  ('canto', 'La Dinámica del Estilo (Fase Vector)', 3),
  ('canto', 'La Trascendencia Acústica (Fase Custom/Elite)', 4)
) as b(slug, nombre, posicion)
where pilares.slug = b.slug;

insert into public.bloques (pilar_id, nombre, posicion, es_transversal)
select pilares.id, b.nombre, b.posicion, false
from public.pilares, (values
  ('teoria-musical', 'Nivel Inicial (Fase Semilla)', 1),
  ('teoria-musical', 'Nivel Intermedio (Fase Core)', 2),
  ('teoria-musical', 'Nivel Avanzado (Fase Maestría)', 3),
  ('teoria-musical', 'Nivel Experto (Fase Erudito / Cúspide Académica)', 4)
) as b(slug, nombre, posicion)
where pilares.slug = b.slug;

insert into public.bloques (pilar_id, nombre, posicion, es_transversal)
select id, 'Bloque Transversal — Laboratorio Práctico de Élite', null, true
from public.pilares
where pilares.slug = 'teoria-musical';
