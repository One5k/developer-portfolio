-- Universal Database Schema (PostgreSQL / MySQL Compatible)
-- Designed for Portfolio Admin Hub

-- 1. Profile / Settings (Global Contact Info & Socials)
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255), -- Job Title
    title_ar VARCHAR(255),
    bio_en TEXT, -- Short Bio
    bio_ar TEXT,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    location_en VARCHAR(255),
    location_ar VARCHAR(255),
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    resume_url TEXT, -- Link to CV download
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hero Section (First Fold Content)
CREATE TABLE IF NOT EXISTS hero_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    greeting_en VARCHAR(255), -- e.g., "Hello, I am"
    greeting_ar VARCHAR(255),
    title_en VARCHAR(255), -- e.g., "Full Stack Developer"
    title_ar VARCHAR(255),
    subtitle_en TEXT, -- e.g., "I build accessible, pixel-perfect web experiences."
    subtitle_ar TEXT,
    description_en TEXT,
    description_ar TEXT,
    hero_image_url TEXT, -- The main large image
    hero_bg_color VARCHAR(50), -- Optional: Hex code or class
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. About Section (Detailed Info)
CREATE TABLE IF NOT EXISTS about_section (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bio_en TEXT,
    bio_ar TEXT,
    about_image_url TEXT, -- Distinct from hero image
    years_of_experience INTEGER,
    completed_projects_count INTEGER,
    happy_clients_count INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Experiences (Work History)
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_en VARCHAR(255) NOT NULL,
    company_ar VARCHAR(255) NOT NULL,
    position_en VARCHAR(255) NOT NULL,
    position_ar VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- 'Full-time', 'Freelance'
    start_date DATE NOT NULL,
    end_date DATE, -- NULL = Present
    description_en TEXT,
    description_ar TEXT,
    company_logo_url TEXT,
    company_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4.5 Education
CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree_en VARCHAR(255) NOT NULL,
    degree_ar VARCHAR(255) NOT NULL,
    institution_en VARCHAR(255) NOT NULL,
    institution_ar VARCHAR(255) NOT NULL,
    field_of_study_en VARCHAR(255),
    field_of_study_ar VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE,
    description_en TEXT,
    description_ar TEXT,
    location_en VARCHAR(255),
    location_ar VARCHAR(255),
    gpa VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Skills (Technologies)
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_ar VARCHAR(100),
    category VARCHAR(50), -- 'frontend', 'backend', 'tools'
    icon_name VARCHAR(50), -- e.g., 'react', 'nodejs'
    proficiency INTEGER, -- 0-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Projects
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_ar VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    category VARCHAR(50),
    image_url TEXT,
    live_url VARCHAR(255),
    github_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Project Skills (Relation)
CREATE TABLE IF NOT EXISTS project_skills (
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);

-- 8. Certificates
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    issuer_en VARCHAR(255),
    issuer_ar VARCHAR(255),
    issue_date DATE,
    credential_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    content TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Admin Users (Authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Hashed password (bcrypt)
    role VARCHAR(50) DEFAULT 'admin', -- 'admin', 'super_admin'
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. SEO Settings (Dynamic Meta Tags)
CREATE TABLE IF NOT EXISTS seo_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_identifier VARCHAR(100) UNIQUE NOT NULL, -- 'home', 'about', 'projects'
    meta_title_en VARCHAR(255),
    meta_title_ar VARCHAR(255),
    meta_description_en TEXT,
    meta_description_ar TEXT,
    meta_keywords TEXT,
    og_image_url TEXT, -- Open Graph image
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
