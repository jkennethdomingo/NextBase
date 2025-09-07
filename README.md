<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="NextBase - A Next.js 15 + Supabase + PWA Starter Kit" src="https://demo-nextjs-with-supabase.vercel.app/opengraph-image.png">
  <h1 align="center">NextBase</h1>
</a>

<p align="center">
 A Next.js 15 + Supabase + PWA Starter Kit
</p>

---

## 🚀 Features

This project was **initially created with**:

```bash
npx create-next-app -e with-supabase
````

Which provides:

* Works across the entire [Next.js](https://nextjs.org) 15 stack

  * App Router + Pages Router
  * Middleware, Client, Server
* Supabase Auth with cookie-based SSR
* Password-based authentication via [Supabase UI Library](https://supabase.com/ui/docs/nextjs/password-based-auth)
* Styling with [Tailwind CSS](https://tailwindcss.com)
* Components with [shadcn/ui](https://ui.shadcn.com/)

### 🔹 Added: PWA Support

On top of the Supabase starter, **NextBase** adds full **Progressive Web App (PWA)** functionality:

* Custom Service Worker with:

  * Pre-caching of `/`, `/offline`, manifest, icons, favicon
  * Network-first for navigations
  * Stale-while-revalidate for JS/CSS chunks
  * Cache-first for images, fonts, and static assets
  * Offline fallback page (`/offline`)
* Install prompt (add to home screen)
* Offline indicator banner
* Automatic redirect to `/offline` when offline
* Sample PWA icons (`192x192`, `512x512`) in `/public`

---

## 🛠️ Run locally

1. Create a Supabase project from the [dashboard](https://database.new)

2. Clone this repo and install dependencies

3. Rename `.env.example` → `.env.local` and update with your Supabase project values:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

The app should now run on [http://localhost:3000](http://localhost:3000).

