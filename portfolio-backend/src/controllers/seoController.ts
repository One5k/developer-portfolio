import { Request, Response } from 'express';
import { db } from '../config/database';

// Get SEO settings for a specific page identifier
export const getSeoSettings = async (req: Request, res: Response) => {
    try {
        const { page } = req.params;
        const settings = await db.query('SELECT * FROM seo_settings WHERE page_identifier = ?', [page]);

        if (settings.length === 0) {
            // Return default/empty structure if not found, or 404. 
            // Better to return null so frontend knows to use defaults.
            return res.json({ seo: null });
        }

        res.json({ seo: settings[0] });
    } catch (error) {
        console.error('Get SEO settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update or Create SEO settings
export const updateSeoSettings = async (req: Request, res: Response) => {
    try {
        const { page } = req.params;
        const {
            meta_title_en,
            meta_title_ar,
            meta_description_en,
            meta_description_ar,
            meta_keywords,
            og_image_url
        } = req.body;

        // Check if exists
        const existing = await db.query('SELECT id FROM seo_settings WHERE page_identifier = ?', [page]);

        if (existing.length > 0) {
            // Update
            await db.query(
                `UPDATE seo_settings SET 
         meta_title_en = ?, meta_title_ar = ?, 
         meta_description_en = ?, meta_description_ar = ?, 
         meta_keywords = ?, og_image_url = ?, updated_at = CURRENT_TIMESTAMP
         WHERE page_identifier = ?`,
                [meta_title_en, meta_title_ar, meta_description_en, meta_description_ar, meta_keywords, og_image_url, page]
            );
        } else {
            // Insert
            await db.query(
                `INSERT INTO seo_settings 
         (page_identifier, meta_title_en, meta_title_ar, meta_description_en, meta_description_ar, meta_keywords, og_image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [page, meta_title_en, meta_title_ar, meta_description_en, meta_description_ar, meta_keywords, og_image_url]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Update SEO settings error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
