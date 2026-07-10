# Developer Portfolio & Admin Dashboard

A premium, serverless developer portfolio with a fully-integrated administration dashboard built using React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Key Features

*   **Bilingual Support (AR/EN):** Full localization for both the public-facing portfolio and the admin management panels.
*   **Fully Serverless:** Directly integrates with Supabase (Database, Auth, and Storage) avoiding any traditional backend costs.
*   **Custom Admin Dashboard:** Manage skill levels, certifications, educational background, work experiences, messages, SEO tags, and hero assets dynamically.
*   **Bilingual Resume/CV Upload:** Separate PDF upload targets for Arabic and English resumes powered by Supabase Storage.
*   **Premium Visual Experience:** Smooth micro-animations, modern typography, glassmorphism UI cards, and responsive styling.

## 🛠️ Technology Stack

*   **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide icons, Shadcn UI
*   **Backend / Services:** Supabase (Authentication, Postgres Database with RLS policies, Storage buckets)

## 💻 Local Development

### 1. Clone & Install Dependencies
```sh
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Development Server
```sh
npm run dev
```

### 4. Build Production Bundle
```sh
npm run build
```
