# 14 — Despliegue en Vercel

## Estado actual (2026-07-13)

Se publicó un primer deploy manual vía el MCP de Vercel (`deploy_to_vercel`,
subida directa de archivos, sin conexión a Git):

- **Proyecto Vercel:** `teclas-jade-web` (`prj_8Hg29KT1FE3yAHWEkaJlydVIawag`)
- **Team:** `davidbertorello82-5064's projects` (`team_X73SfElyRTkhlVCwIb8Qiii2`)
- **URL de producción:** https://teclas-jade-web.vercel.app
- **Build:** OK (Next.js 16 / Turbopack, sin errores de compilación).
- **Runtime: ROTO (500 en todas las rutas).** `middleware.ts` corre en
  practicamente todas las requests (matcher excluye solo estáticos) y llama a
  `createServerClient` con `NEXT_PUBLIC_SUPABASE_URL` /
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` — como el proyecto de Vercel no tiene
  ninguna variable de entorno configurada todavía, tira
  `Your project's URL and Key are required to create a Supabase client!`
  antes de llegar a cualquier página, incluida la home.

## Por qué este deploy es un parche, no la solución definitiva

`deploy_to_vercel` sube un snapshot de archivos tal cual se lo mandás en ese
momento — no queda conectado al repo de GitHub
(`davidbertorello82-boop/TeclasJade`, rama `main`). Ademas:

- No incluye `public/brand/logo-principal.png`, `logo-simplificado.png` ni
  `foto-perfil.jpeg` (son binarios; transcribirlos a mano por chat no es
  confiable). El Hero y la sección Bio de la home van a mostrar el `alt` en
  vez de la imagen hasta que se resuelva esto.
- No incluye `package-lock.json` (Vercel instaló con `npm install` en vez de
  usar el lockfile exacto del repo).
- Cualquier cambio nuevo en el código **no se refleja solo**: hay que volver
  a correr el deploy manualmente cada vez.

## La solución correcta: conectar el repo de GitHub en Vercel

Esto resuelve TODO lo de arriba de una sola vez (imágenes completas,
lockfile, y auto-deploy en cada `git push` a `main`). Es un paso único,
manual, ~2 minutos, porque requiere autorizar el acceso de Vercel a GitHub
desde el propio dashboard:

1. Entrar a https://vercel.com/davidbertorello82-5064s-projects/teclas-jade-web
2. Settings → Git → **Connect Git Repository** → elegir
   `davidbertorello82-boop/TeclasJade` (rama `main`). Si Vercel no ve el repo
   todavía, hay que autorizar la GitHub App de Vercel a verlo desde GitHub.
3. Una vez conectado, cada `git push` a `main` dispara un deploy de
   producción automático — este es el mecanismo que hace que "los cambios
   siempre se vean" en el link.

## Variables de entorno pendientes (Project Settings → Environment Variables)

Sin esto el sitio sigue en 500 pase lo que pase con el punto anterior. Los
*valores* están en `contraseñas y Project URL/` (fuera del repo) y en el
dashboard de Supabase / Mercado Pago — nunca se pegan acá ni en el chat.

| Variable | Dónde conseguirla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API (secreta, solo servidor) |
| `NEXT_PUBLIC_SITE_URL` | La URL pública real (ej. `https://teclas-jade-web.vercel.app` o el dominio final) |
| `MERCADOPAGO_ACCESS_TOKEN` | Panel de desarrolladores de Mercado Pago |
| `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` | Panel de desarrolladores de Mercado Pago |
| `MERCADOPAGO_WEBHOOK_SECRET` | Panel de desarrolladores de Mercado Pago (ver bug conocido en `src/app/api/mercadopago/webhook/route.ts`) |

## Próximo paso

Conectar el Git Integration (sección de arriba) + cargar las variables de
entorno. Después de eso, este documento debería actualizarse para reflejar
que el despliegue quedó en modo auto-deploy.
