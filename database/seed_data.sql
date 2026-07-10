-- Admin User (Password: admin123)
-- Ideally, create the user via the /api/auth/register endpoint.
-- or manually insert if you have the hash.

-- Profile Data (Removed user_id, it is not in schema)
INSERT INTO profile (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, email, phone, location_en, location_ar, github_url, linkedin_url, twitter_url, resume_url) VALUES 
('John Doe', 'جون دو', 'Full Stack Developer', 'مطور ويب شامل', 'Passionate developer with 5 years of experience.', 'مطور شغوف بخبرة 5 سنوات.', 'john@example.com', '+1234567890', 'New York, USA', 'نيويورك، أمريكا', 'https://github.com/johndoe', 'https://linkedin.com/in/johndoe', 'https://twitter.com/johndoe', 'https://example.com/cv.pdf');

-- Hero Section (Fixed column name hero_image_url)
INSERT INTO hero_section (greeting_en, greeting_ar, title_en, title_ar, subtitle_en, subtitle_ar, description_en, description_ar, hero_image_url) VALUES
('Hello, I am', 'مرحباً، أنا', 'John Doe', 'جون دو', 'Building Digital Experiences', 'بناء تجارب رقمية', 'I craft robust and scalable web applications.', 'أقوم بتصميم تطبيقات ويب قوية وقابلة للتوسع.', 'https://github.com/shadcn.png');

-- About Section (Fixed column name about_image_url and columns)
INSERT INTO about_section (bio_en, bio_ar, about_image_url, years_of_experience, completed_projects_count, happy_clients_count) VALUES
('I specialize in React and Node.js.', 'أنا متخصص في React و Node.js.', 'https://github.com/shadcn.png', 5, 20, 15);

-- Skills
INSERT INTO skills (name_en, name_ar, category, proficiency, icon_name) VALUES
('React', 'رياكت', 'frontend', 90, 'react'),
('TypeScript', 'تايب سكريبت', 'frontend', 85, 'typescript'),
('Node.js', 'نود جي إس', 'backend', 80, 'nodejs'),
('MySQL', 'ماي إس كيو إل', 'backend', 75, 'mysql'),
('Figma', 'فيجما', 'tools', 70, 'figma');

-- Projects
INSERT INTO projects (title_en, title_ar, description_en, description_ar, image_url, category, live_url, github_url, is_featured) VALUES
('E-commerce Platform', 'منصة تجارة إلكترونية', 'A full-featured online store.', 'متجر إلكتروني كامل المميزات.', 'https://images.unsplash.com/photo-1557821552-17105176677c', 'fullstack', 'https://example.com', 'https://github.com/example/repo', TRUE),
('Portfolio Website', 'موقع شخصي', 'My personal portfolio website.', 'موقعي الشخصي.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', 'frontend', 'https://example.com', 'https://github.com/example/portfolio', FALSE);

-- Certificates
INSERT INTO certificates (title_en, title_ar, issuer_en, issuer_ar, issue_date, credential_url) VALUES
('AWS Certified Cloud Practitioner', 'ممارس سحابي معتمد من AWS', 'Amazon Web Services', 'أمازون ويب سيرفيسز', '2023-01-15', 'https://aws.amazon.com/verification'),
('Meta Frontend Developer', 'مطور واجهة أمامية من ميتا', 'Coursera', 'كورسيرا', '2022-06-20', 'https://coursera.org/verify');

-- Messages
INSERT INTO messages (sender_name, sender_email, content, is_read) VALUES
('Alice Smith', 'alice@example.com', 'Hi, I would like to discuss a project.', FALSE),
('Bob Johnson', 'bob@example.com', 'Great portfolio!', TRUE);

-- Experiences
-- Note: Ensure this table exists in your database creation script. If not, run this:
-- CREATE TABLE IF NOT EXISTS experiences (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   company_en VARCHAR(255) NOT NULL,
--   company_ar VARCHAR(255) NOT NULL,
--   position_en VARCHAR(255) NOT NULL,
--   position_ar VARCHAR(255) NOT NULL,
--   type VARCHAR(50) DEFAULT 'work',
--   start_date DATE NOT NULL,
--   end_date DATE,
--   description_en TEXT,
--   description_ar TEXT,
--   company_logo_url VARCHAR(255),
--   company_url VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

INSERT INTO experiences (company_en, company_ar, position_en, position_ar, start_date, end_date, description_en, description_ar, type, company_url) VALUES
('Tech Corp', 'شركة التقنية', 'Senior Developer', 'مطور أول', '2020-01-01', NULL, 'Leading the frontend team.', 'قيادة فريق الواجهة الأمامية.', 'work', 'https://techcorp.com'),
('Startup Inc', 'ستارت أب', 'Frontend Developer', 'مطور واجهة أمامية', '2018-05-01', '2019-12-31', 'Built the main product UI.', 'بناء واجهة المنتج الرئيسية.', 'work', NULL);

-- Education Seed Data
INSERT INTO education (
  degree_en, degree_ar,
  institution_en, institution_ar,
  field_of_study_en, field_of_study_ar,
  start_date, end_date,
  description_en, description_ar,
  location_en, location_ar,
  gpa
) VALUES (
  'Bachelor of Computer Science', 'بكالوريوس علوم الحاسوب',
  'University of Technology', 'جامعة التكنولوجيا',
  'Software Engineering', 'هندسة البرمجيات',
  '2015-09-01', '2019-06-30',
  'Graduated with honors, specialized in software engineering and web technologies',
  'تخرجت بمرتبة الشرف، تخصص هندسة البرمجيات وتقنيات الويب',
  'New York, USA', 'نيويورك، أمريكا',
  '3.8'
);

-- Soft Skills Seed Data
INSERT INTO skills (name_en, name_ar, category, proficiency, icon_name) VALUES
('Problem Solving', 'حل المشكلات', 'soft', 95, 'brain'),
('Team Collaboration', 'العمل الجماعي', 'soft', 90, 'users'),
('Communication', 'التواصل', 'soft', 88, 'message'),
('Time Management', 'إدارة الوقت', 'soft', 85, 'clock'),
('Leadership', 'القيادة', 'soft', 82, 'award');
