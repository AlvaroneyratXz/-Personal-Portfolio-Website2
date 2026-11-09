# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Publicar en Vercel

Importa el repositorio en Vercel y conserva el comando de compilación `npm run build`. La configuración selecciona Nitro para Vercel y mantiene el renderizado del servidor; no configures el proyecto como sitio estático.

En **Project Settings → Environment Variables**, agrega estas variables para los entornos que usarás (Production, Preview y Development):

| Variable | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | Dirección pública de Lovable Cloud para el navegador. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública de Lovable Cloud para el navegador. |
| `SUPABASE_URL` | Dirección de Lovable Cloud usada durante el renderizado del servidor. |
| `SUPABASE_PUBLISHABLE_KEY` | Clave pública usada por las funciones del servidor. |

Usa los valores de la configuración de Lovable Cloud; las variables locales de `.env` no se copian automáticamente a Vercel. No agregues claves privadas con prefijo `VITE_`. `SUPABASE_SERVICE_ROLE_KEY` no es necesaria para las rutas actuales y no debe configurarse salvo que se añada una operación privada que la requiera. Después del primer despliegue, agrega el dominio de Vercel a los dominios permitidos de inicio de sesión de Lovable Cloud y prueba `/` y `/administrador`.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
