-- Add missing columns to profile table to match Frontend/API expectations
ALTER TABLE profile ADD COLUMN title_en VARCHAR(255) AFTER name_ar;
ALTER TABLE profile ADD COLUMN title_ar VARCHAR(255) AFTER title_en;
ALTER TABLE profile ADD COLUMN bio_en TEXT AFTER title_ar;
ALTER TABLE profile ADD COLUMN bio_ar TEXT AFTER bio_en;
