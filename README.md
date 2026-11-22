# Synscape — Audiovisual Culture & Electronic Sessions

Unified full-stack web application with immersive scrollytelling transition, built with **React**, **Tailwind CSS**, **Node.js**, **Prisma** (Supabase PostgreSQL), and **Cloudinary**.

---

## Visual Design Reference
- **Hero Section (Image 1)**: Fullscreen video background (`LANDING.mp4`), semi-transparent grey logo (`logo.svg`), subtle architectural emblem, and minimalist top-right hamburger navigation. Zero unnecessary text/ornaments.
- **Showcase Section (Image 2)**: Staggered / tiered ("bertingkat") layout reached upon scrolling down:
  - **MORE THAN MUSIC**: Positioned high on the left with manifesto, discovery call-to-action, and light-grey media grid.
  - **UPCOMING EVENT / 001**: Staggered lower down on the right with Session III event card, `banner.png` poster, date/location metadata, and ticket reservation.
  - **COMMUNITY**: Segmented roster of DJs and Visual Artists with light-grey circular avatar nodes and metadata.
  - **AUDIOVISUAL ARCHIVE**: Offset left-aligned video showcase (`SYNESCAPE SESSION 001`) with right-hand vertical label tab.
  - **STAY IN THE LOOP**: Newsletter email subscription form with underline input and social links.

---

## Unified Project Structure

```text
synscapes/
├── package.json              # Single unified package (React, Tailwind, Node, Prisma, Vite)
├── start-dev.js              # One-command runner for server & client
├── vite.config.js            # Vite configuration with /api proxy to server
├── tailwind.config.js        # Design tokens & glassmorphism theme
├── postcss.config.js
├── index.html                # Single HTML root shell
├── banner.png                # Event poster asset
├── LANDING.mp4               # Cinematic ambient video backdrop
├── logo.svg                  # Brand vector mark
├── public/                   # Static assets & public media
├── prisma/                   # Database schema & seeders
│   ├── schema.prisma
│   └── seed.js
├── server/                   # Backend API (Express, Prisma config, Cloudinary, routes)
│   ├── index.js              # Express app entry
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── services/
└── src/                      # Frontend React application
    ├── components/           # Navbar, Hero, AboutSection, EventCard, Community, Archive, Footer
    ├── services/api.js       # Unified API client layer
    ├── App.jsx               # Master scrollytelling orchestrator
    ├── index.css             # Base & utility styles
    └── main.jsx
```

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Secrets (Optional)
The application works immediately out-of-the-box with built-in mock fallbacks. To connect to production cloud providers, set up `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Run Development Server
```bash
npm run dev
```
- Frontend UI: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- API Health Check: `http://localhost:5000/api/health`
