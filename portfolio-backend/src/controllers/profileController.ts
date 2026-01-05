import { Request, Response } from 'express';
import { db } from '../config/database';

// Get Profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await db.query('SELECT * FROM profile LIMIT 1');
    
    if (profile.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({ profile: profile[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const {
      name_en,
      name_ar,
      title_en,
      title_ar,
      bio_en,
      bio_ar,
      email,
      phone,
      location_en,
      location_ar,
      linkedin_url,
      github_url,
      twitter_url,
      instagram_url,
      resume_url,
    } = req.body;

    // Check if profile exists
    const existing = await db.query('SELECT id FROM profile LIMIT 1');

    if (existing.length === 0) {
      // Create new profile
      await db.query(
        `INSERT INTO profile 
        (name_en, name_ar, title_en, title_ar, bio_en, bio_ar, email, phone, location_en, location_ar, linkedin_url, github_url, twitter_url, instagram_url, resume_url) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name_en, name_ar, title_en, title_ar, bio_en, bio_ar, email, phone, location_en, location_ar, linkedin_url, github_url, twitter_url, instagram_url, resume_url]
      );
    } else {
      // Update existing profile
      await db.query(
        `UPDATE profile SET 
        name_en = ?, name_ar = ?, title_en = ?, title_ar = ?, bio_en = ?, bio_ar = ?, 
        email = ?, phone = ?, location_en = ?, location_ar = ?, 
        linkedin_url = ?, github_url = ?, twitter_url = ?, instagram_url = ?, 
        resume_url = ?, updated_at = NOW() 
        WHERE id = ?`,
        [name_en, name_ar, title_en, title_ar, bio_en, bio_ar, email, phone, location_en, location_ar, linkedin_url, github_url, twitter_url, instagram_url, resume_url, existing[0].id]
      );
    }

    const updated = await db.query('SELECT * FROM profile LIMIT 1');
    res.json({ success: true, profile: updated[0] });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get Hero Section
export const getHeroSection = async (req: Request, res: Response) => {
  try {
    const hero = await db.query('SELECT * FROM hero_section LIMIT 1');
    
    if (hero.length === 0) {
      return res.status(404).json({ error: 'Hero section not found' });
    }
    
    res.json({ hero: hero[0] });
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update Hero Section
export const updateHeroSection = async (req: Request, res: Response) => {
  try {
    const {
      greeting_en,
      greeting_ar,
      title_en,
      title_ar,
      subtitle_en,
      subtitle_ar,
      description_en,
      description_ar,
      hero_image_url,
      hero_bg_color,
    } = req.body;

    const existing = await db.query('SELECT id FROM hero_section LIMIT 1');

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO hero_section 
        (greeting_en, greeting_ar, title_en, title_ar, subtitle_en, subtitle_ar, description_en, description_ar, hero_image_url, hero_bg_color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [greeting_en, greeting_ar, title_en, title_ar, subtitle_en, subtitle_ar, description_en, description_ar, hero_image_url, hero_bg_color]
      );
    } else {
      await db.query(
        `UPDATE hero_section SET 
        greeting_en = ?, greeting_ar = ?, title_en = ?, title_ar = ?, subtitle_en = ?, subtitle_ar = ?, 
        description_en = ?, description_ar = ?, hero_image_url = ?, 
        hero_bg_color = ?, updated_at = NOW() 
        WHERE id = ?`,
        [greeting_en, greeting_ar, title_en, title_ar, subtitle_en, subtitle_ar, description_en, description_ar, hero_image_url, hero_bg_color, existing[0].id]
      );
    }

    const updated = await db.query('SELECT * FROM hero_section LIMIT 1');
    res.json({ success: true, hero: updated[0] });
  } catch (error) {
    console.error('Update hero error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get About Section
export const getAboutSection = async (req: Request, res: Response) => {
  try {
    const about = await db.query('SELECT * FROM about_section LIMIT 1');
    
    if (about.length === 0) {
      return res.status(404).json({ error: 'About section not found' });
    }
    
    res.json({ about: about[0] });
  } catch (error) {
    console.error('Get about error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update About Section
export const updateAboutSection = async (req: Request, res: Response) => {
  try {
    const {
      bio_en,
      bio_ar,
      about_image_url,
      years_of_experience,
      completed_projects_count,
      happy_clients_count,
    } = req.body;

    const existing = await db.query('SELECT id FROM about_section LIMIT 1');

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO about_section 
        (bio_en, bio_ar, about_image_url, years_of_experience, completed_projects_count, happy_clients_count) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [bio_en, bio_ar, about_image_url, years_of_experience, completed_projects_count, happy_clients_count]
      );
    } else {
      await db.query(
        `UPDATE about_section SET 
        bio_en = ?, bio_ar = ?, about_image_url = ?, 
        years_of_experience = ?, completed_projects_count = ?, 
        happy_clients_count = ?, updated_at = NOW() 
        WHERE id = ?`,
        [bio_en, bio_ar, about_image_url, years_of_experience, completed_projects_count, happy_clients_count, existing[0].id]
      );
    }

    const updated = await db.query('SELECT * FROM about_section LIMIT 1');
    res.json({ success: true, about: updated[0] });
  } catch (error) {
    console.error('Update about error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
