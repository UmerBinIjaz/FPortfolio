# Faryal — Academic & Professional E-Portfolio

A full-stack, database-driven Academic & Professional E-Portfolio built for **Faryal**, Bachelor of English student at Air University and aspiring English Language Educator.

---

## Technology Stack

- **Framework:** Next.js 15 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS v4, `@tailwindcss/typography`, Lucide React, Motion (`motion/react`)
- **Forms & Validation:** React Hook Form, Zod
- **Database & ORM:** Neon Serverless PostgreSQL, Prisma ORM 6.4.1
- **Authentication & Security:** `bcryptjs`, HMAC-SHA256 signed HTTP-only cookies backed by PostgreSQL `Session` records, CSRF origin checks, sliding-window rate limiting, HTML sanitization
- **Media Storage:** Cloudinary (server-side uploads for images, PDFs, Office documents, and videos)
- **PDF Generation:** `@react-pdf/renderer` (real binary PDF CV generated dynamically from PostgreSQL data)

---

## Project Structure

```text
├── prisma/
│   ├── schema.prisma              # 25-model relational PostgreSQL schema
│   ├── seed.ts                    # Authentic initial data + secure admin account seed
│   └── migrations/                # SQL migration history
├── public/
│   └── assets/aistudio/           # Original attached CV PDF
├── app/
│   ├── (public)/                  # Public routes (/, /about, /portfolio, /webinars, /symposium, /teaching-practicum, /resume, /achievements, /reflections, /contact)
│   ├── admin/
│   │   ├── login/                 # Administrator sign-in
│   │   └── (protected)/           # Protected Admin Panel (/admin/dashboard, home, about, portfolio, webinars, symposium, teaching-practicum, resume, achievements, reflections, messages, media, settings)
│   ├── api/
│   │   ├── auth/                  # login, logout, password change
│   │   ├── contact/               # Public contact submission endpoint
│   │   ├── resume/pdf/            # Dynamic @react-pdf/renderer PDF download
│   │   ├── upload/                # Authenticated Cloudinary upload endpoint
│   │   └── admin/media/[id]/      # Safe relationship-checked media deletion
│   ├── sitemap.ts                 # Dynamic sitemap.xml
│   └── robots.ts                  # robots.txt
├── actions/                       # Protected Next.js Server Actions for CRUD mutations
├── components/                    # Reusable UI, public browsers, and admin editors
├── lib/                           # Prisma singleton, auth, session, Cloudinary, Zod schemas, sanitizer, rate limiter
└── middleware.ts                  # Edge route protection for /admin/*
```

---

## Neon PostgreSQL Console & Database Setup Guide

Follow these exact steps to provision and connect your Neon PostgreSQL database:

1. **Create a Neon Account**
   - Visit [https://console.neon.tech](https://console.neon.tech) and sign up or sign in.
2. **Create a New Neon Project**
   - Click **New Project**.
   - Enter a project name such as `faryal-eportfolio`.
3. **Select PostgreSQL Version & Region**
   - Choose PostgreSQL 16 (or latest default).
   - Select a cloud region close to your deployment target (e.g., AWS `ap-southeast-1` Singapore or `us-east-1`).
4. **Create / Verify the Database**
   - Neon creates a default database (`neondb`) and role automatically. You may keep `neondb` or create a dedicated database under **Databases** in the Neon Console.
5. **Retrieve the Pooled Connection String (`DATABASE_URL`)**
   - Open your project dashboard -> **Connection Details**.
   - Toggle **Connection pooling** **ON** (the host includes `-pooler`).
   - Copy the connection string (it ends with `?sslmode=require`).
   - Set this value as `DATABASE_URL` in your `.env` file.
6. **Retrieve the Direct Connection String (`DIRECT_URL`)**
   - In **Connection Details**, toggle **Connection pooling** **OFF** to obtain the direct (unpooled) host.
   - Copy that connection string and set it as `DIRECT_URL` in `.env`.
7. **Configure `.env`**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in `DATABASE_URL`, `DIRECT_URL`, a random 32+ character `AUTH_SECRET` (`openssl rand -hex 32`), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and your Cloudinary credentials.
   - Never commit `.env` to version control.
8. **Install Dependencies & Generate Prisma Client**
   ```bash
   npm install
   npx prisma generate
   ```
9. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   # Or during local schema iteration:
   npx prisma migrate dev --name init
   ```
10. **Seed Authentic Initial Data & Administrator Account**
    ```bash
    npm run db:seed
    ```
    This reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`, hashes the password with `bcryptjs`, and seeds Faryal's authentic profile, education, skills, DigiSkills.pk training, and blog categories without creating fictional records.
11. **Inspect Tables & Verify Connectivity**
    ```bash
    npm run db:studio
    ```
    Prisma Studio opens in your browser so you can inspect all 25 tables and verify seeded rows.

---

## Cloudinary Configuration

1. Create an account at [https://cloudinary.com](https://cloudinary.com).
2. From the **Programmable Media Dashboard**, copy:
   - **Cloud Name** -> `CLOUDINARY_CLOUD_NAME`
   - **API Key** -> `CLOUDINARY_API_KEY`
   - **API Secret** -> `CLOUDINARY_API_SECRET`
3. Add these three server-only variables to `.env` (never prefix them with `NEXT_PUBLIC_`).
4. Uploads are processed strictly on the server via `POST /api/upload`, restricted to authenticated administrators, validated by extension, MIME type, and file size, and tracked in the `MediaAsset` table.

---

## Local Development & Production Commands

```bash
# Development server (port 3000)
npm run dev

# TypeScript type check
npm run typecheck

# ESLint check
npm run lint

# Production build & start
npm run build
npm run start
```

---

## Troubleshooting

- **Cannot sign in at `/admin/login`**: Verify `DATABASE_URL`, `DIRECT_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are set in `.env`, migrations have run (`npx prisma migrate deploy`), and `npm run db:seed` completed successfully.
- **Media upload fails**: Confirm `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set in `.env` and that the uploaded file matches the allowed extensions and size limits.
- **Migration fails on Neon**: Ensure `DIRECT_URL` uses the **unpooled** Neon endpoint (without `-pooler`), while `DATABASE_URL` uses the pooled endpoint.
