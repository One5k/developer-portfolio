-- Add missing columns to hero_section table
ALTER TABLE hero_section ADD COLUMN greeting_en VARCHAR(255) AFTER id;
ALTER TABLE hero_section ADD COLUMN greeting_ar VARCHAR(255) AFTER greeting_en;
