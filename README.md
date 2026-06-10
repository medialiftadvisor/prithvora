# PRITHVORA AGRIVERSE Website

> "From Farmers' Dreams to Every Family's Table"

PRITHVORA AGRIVERSE is a world-class, production-ready sustainable agritech web portal. It connects rural organic farmers directly with modern urban households, delivering certified dairy, wildflower honey, wood-pressed oils, fresh produce, and organic pickles.

The platform is designed to be premium, corporate, and investor-grade, matching the design aesthetics of Apple and Tesla.

---

## 🚀 Key Features

1. **Cinematic Hero Landing**: Full-screen interactive 3D WebGL scene built using Three.js and React Three Fiber (R3F) showing a revolving space Earth transitioning to green gridded farmland rows on scroll, under sunrise morning lights.
2. **E-Commerce Portal**: Full category filtering, search, interactive product detail modals (displaying nutritional values, benefits, and stock checks), and a multi-step Checkout form linked to a simulated Order Tracking pipeline.
3. **Zustand Cart & Wishlist**: Client-side persisted shopping cart and wishlist toggling in local storage.
4. **Investor Dashboard**: Interactive charts depicting TAM segmentation, 5-Year Revenue projections, and Breakeven analyses using Recharts.
5. **Farmer Map**: Interactive SVG Map of India displaying collection hubs and grower statistics.
6. **NextAuth Security**: Dynamic authentication handlers with custom credential signing and role-based permissions (`USER` vs. `ADMIN`).
7. **Careers Hub & Partner Tiers**: Dynamic application forms for employee recruitment and partner registration.
8. **Admin Control Console**: Restricted console for verified admins to perform CRUD tasks, approve farmers, monitor partners, track orders, and view metrics.

---

## 🛠️ Technology Stack

- **Core Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion & GSAP
- **3D Engine**: Three.js & React Three Fiber (R3F)
- **Data Analytics**: Recharts
- **Icons**: Lucide React

---

## ⚙️ Project Structure

```text
PRITHVORA/
├── prisma/
│   └── schema.prisma          # Database schema (PostgreSQL)
├── src/
│   ├── app/                   # App Router pages
│   │   ├── about/             # Story & Milestone Timeline
│   │   ├── admin/             # Console Dashboard (Protected)
│   │   ├── api/               # API routes (Auth, leads)
│   │   ├── blog/              # SEO Articles
│   │   ├── careers/           # Job Openings
│   │   ├── contact/           # Map & WhatsApp Integration
│   │   ├── farmer/            # India Map & Farmer Portal
│   │   ├── investor/          # Projections & Accredited Inquiries
│   │   ├── partner/           # Partnership benefits and forms
│   │   ├── products/          # Organic store & Checkout
│   │   ├── globals.css        # Tailwind theme variables
│   │   ├── layout.tsx         # Page skeleton & SEO metadata
│   │   └── page.tsx           # Home Page with R3F canvas
│   ├── components/            # UI Components
│   │   ├── 3d/                # Three.js R3F components
│   │   └── layout/            # Header, Footer, Cart sidebar
│   ├── lib/                   # Database client & Auth config
│   └── store/                 # Zustand store state
```

---

## 💻 Local Setup & Installation

### 1. Clone & Install Dependencies
Ensure you have Node.js (v20+ recommended) and npm installed:
```bash
# Clone the repository
git clone <repository-url>
cd PRITHVORA

# Install dependencies
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and copy the contents from `.env.example`:
```bash
cp .env.example .env
```
Provide your PostgreSQL connection parameters in the `DATABASE_URL` field:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/prithvora?schema=public"
```

### 3. Sync Database Schema
Initialize your PostgreSQL database tables using Prisma:
```bash
# Generate Prisma Client
npx prisma generate

# Apply schema migrations to database
npx prisma db push
```

### 4. Run Development Server
Start the local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## ☁️ Vercel One-Click Deployment Ready

This project is prepared for deployment on Vercel:

1. **Push your code** to a GitHub/GitLab/Bitbucket repository.
2. **Connect to Vercel**: Import the repository in your Vercel Dashboard.
3. **Environment Variables**: Add the following in Vercel project settings:
   - `DATABASE_URL` (Use Neon.tech or Supabase for hosted PostgreSQL)
   - `NEXTAUTH_SECRET` (Generate using `openssl rand -base64 32`)
   - `NEXTAUTH_URL` (Your Vercel deployment URL e.g. `https://prithvora.vercel.app`)
4. **Deploy**: Click **Deploy**. Vercel will automatically compile, optimize, and serve the application globally.
