# Anas Taha Al-Amri — Junior Software Engineer & AI-Augmented Developer

<div align="center">
  <h3>🌟 Serverless Developer Portfolio & Admin Hub (Bilingual AR/EN)</h3>
  <p>A premium, state-of-the-art developer portfolio and administrative dashboard built with React, TypeScript, Tailwind CSS, and Supabase.</p>

  [![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
  [![Supabase Integration](https://img.shields.io/badge/Database-Supabase-emerald?style=for-the-badge&logo=supabase)](https://supabase.com)
  [![React Version](https://img.shields.io/badge/Frontend-React%20%26%20TS-blue?style=for-the-badge&logo=react)](https://react.dev)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
</div>

---

## 📖 Overview / نظرة عامة

### English
A premium, highly-optimized developer portfolio designed for **Anas Al-Ameri**. This project features a fully dynamic, bilingual (Arabic & English) public portfolio and a secure, comprehensive administrative dashboard. 
* **Zero Backend Costs:** Leverages Supabase Serverless Architecture (Postgres database, Row Level Security, Auth, and Storage Buckets).
* **AI-Augmented Development Workflow:** Engineered and audited using advanced AI coding workflows (Claude Code, Google Antigravity).

### العربية
حقيبة أعمال برمجية متميزة وعالية الأداء تم تصميمها لـ **أنس العامري**. يتميز هذا المشروع بموقع تعريفي ثنائي اللغة (عربي/إنجليزي) تفاعلي بالكامل، مدعوماً بلوحة تحكم إدارية شاملة وآمنة لإدارة كل تفاصيل الموقع ديناميكياً.
* **بدون تكاليف خادم (Serverless):** يعتمد بالكامل على البنية السحابية لـ Supabase (قاعدة بيانات Postgres، حماية الجداول RLS، نظام المصادقة، ومخازن الملفات).
* **تطوير مدعوم بالذكاء الاصطناعي:** تم بناء وهندسة ومراجعة الأكواد البرمجية بالكامل باستخدام أدوات التطوير الذكية المتقدمة.

---

## 🛠️ Technology Stack / التقنيات المستخدمة

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Shadcn UI, Lucide Icons, React Router DOM (v6)
* **Backend & Database:** Supabase (Serverless Postgres, RLS, Storage Buckets, Auth)
* **Hosting & Routing:** Vercel (custom routing and redirects for Single Page Applications)

---

## ✨ Features / مميزات المشروع

| Feature / الميزة | Description / الوصف |
| :--- | :--- |
| **Bilingual Portfolio (AR/EN)** | Full RTL/LTR support with instant language switching and fluid layout transitions. |
| **Dynamic Content Management** | Admin panels to update Profile info, Hero section, About data, Experiences, Projects, and Certificates. |
| **Bilingual Resume Upload** | Upload separate PDF resumes for English and Arabic readers directly to Supabase storage. |
| **Secure Authentication** | Login gate using hashed credentials with secure session storage and Route protection. |
| **SEO Settings Manager** | Dynamic meta title, description, and keywords updating for individual pages. |
| **Premium Skeleton Loaders** | Zero layout shifts or placeholder flashes during data fetching. |

---

## 🖼️ User Interface / واجهة المستخدم

<div align="center">
  <h4>Main Portfolio Interface / الواجهة الرئيسية لمعرض الأعمال</h4>
  <img src="screen/screencapture-localhost-8080-2026-07-10-21_47_16.png" alt="Portfolio Preview" width="800" />
  
  <br/><br/>
  
  <h4>Admin Management Hub / الواجهة الرئيسية لمعرض الأعمالEn</h4>
  <img src="screen/screencapture-localhost-8080-2026-07-10-21_47_47.png" alt="Admin Hub Preview" width="800" />
</div>

---

## 💻 Local Development Setup / التشغيل المحلي

### 1. Clone the Repository
```bash
git clone https://github.com/One5k/developer-portfolio.git
cd developer-portfolio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and populate it with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. Setup Database Schema
Execute the SQL migrations found in the [`database/db_schema_postgres.sql`](file:///e:/wpgeeks/htdocs/portfolio-admin-hub/database/db_schema_postgres.sql) folder inside your Supabase SQL Editor.

### 5. Run the Application
```bash
npm run dev
```

---

## 🚀 Deployment to Vercel / النشر على فيرسل

1. Push your code to GitHub.
2. Link the repository to Vercel.
3. Configure the environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the Vercel dashboard.
4. Deploy! Single Page Application (SPA) routing is pre-configured via the `vercel.json` rewrite file.

---

## 👤 Contact / للتواصل

* **Email:** aannaass2076@gmail.com
* **LinkedIn:** [Anas Al-Ameri](https://linkedin.com/in/on5k)
* **GitHub:** [@One5k](https://github.com/One5k)
* **Phone:** +967 773 703 388
