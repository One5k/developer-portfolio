import { Request, Response } from 'express';
import { db } from '../config/database';

// Get all skills
export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const skills = await db.query('SELECT * FROM skills ORDER BY category, name_en');
    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single skill
export const getSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const skills = await db.query('SELECT * FROM skills WHERE id = ? LIMIT 1', [id]);
    
    if (skills.length === 0) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.json({ skill: skills[0] });
  } catch (error) {
    console.error('Get skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create skill
export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name_en, name_ar, category, icon_name, proficiency } = req.body;

    const result = await db.query(
      'INSERT INTO skills (name_en, name_ar, category, icon_name, proficiency) VALUES (?, ?, ?, ?, ?)',
      [name_en, name_ar, category, icon_name, proficiency]
    );

    res.status(201).json({ 
      success: true, 
      skillId: result.insertId || result[0]?.id 
    });
  } catch (error) {
    console.error('Create skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update skill
export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name_en, name_ar, category, icon_name, proficiency } = req.body;

    await db.query(
      'UPDATE skills SET name_en = ?, name_ar = ?, category = ?, icon_name = ?, proficiency = ? WHERE id = ?',
      [name_en, name_ar, category, icon_name, proficiency, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete skill
export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all experiences
export const getAllExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await db.query('SELECT * FROM experiences ORDER BY start_date DESC');
    res.json({ experiences });
  } catch (error) {
    console.error('Get experiences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create experience
export const createExperience = async (req: Request, res: Response) => {
  try {
    const {
      company_en,
      company_ar,
      position_en,
      position_ar,
      type,
      start_date,
      end_date,
      description_en,
      description_ar,
      company_logo_url,
      company_url,
    } = req.body;

    const result = await db.query(
      `INSERT INTO experiences 
      (company_en, company_ar, position_en, position_ar, type, start_date, end_date, description_en, description_ar, company_logo_url, company_url) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [company_en, company_ar, position_en, position_ar, type, start_date, end_date || null, description_en, description_ar, company_logo_url, company_url]
    );

    res.status(201).json({ 
      success: true, 
      experienceId: result.insertId || result[0]?.id 
    });
  } catch (error) {
    console.error('Create experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update experience
export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      company_en,
      company_ar,
      position_en,
      position_ar,
      type,
      start_date,
      end_date,
      description_en,
      description_ar,
      company_logo_url,
      company_url,
    } = req.body;

    await db.query(
      `UPDATE experiences SET 
      company_en = ?, company_ar = ?, position_en = ?, position_ar = ?, 
      type = ?, start_date = ?, end_date = ?, description_en = ?, 
      description_ar = ?, company_logo_url = ?, company_url = ? 
      WHERE id = ?`,
      [company_en, company_ar, position_en, position_ar, type, start_date, end_date || null, description_en, description_ar, company_logo_url, company_url, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete experience
export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM experiences WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all certificates
export const getAllCertificates = async (req: Request, res: Response) => {
  try {
    const certificates = await db.query('SELECT * FROM certificates ORDER BY issue_date DESC');
    res.json({ certificates });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create certificate
export const createCertificate = async (req: Request, res: Response) => {
  try {
    const { title_en, title_ar, issuer_en, issuer_ar, issue_date, credential_url } = req.body;

    const result = await db.query(
      'INSERT INTO certificates (title_en, title_ar, issuer_en, issuer_ar, issue_date, credential_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title_en, title_ar, issuer_en, issuer_ar, issue_date, credential_url]
    );

    res.status(201).json({ 
      success: true, 
      certificateId: result.insertId || result[0]?.id 
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update certificate
export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title_en, title_ar, issuer_en, issuer_ar, issue_date, credential_url } = req.body;

    await db.query(
      'UPDATE certificates SET title_en = ?, title_ar = ?, issuer_en = ?, issuer_ar = ?, issue_date = ?, credential_url = ? WHERE id = ?',
      [title_en, title_ar, issuer_en, issuer_ar, issue_date, credential_url, id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete certificate
export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM certificates WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create message (Public)
export const createMessage = async (req: Request, res: Response) => {
  try {
    const { sender_name, sender_email, content } = req.body;

    const result = await db.query(
      'INSERT INTO messages (sender_name, sender_email, content) VALUES (?, ?, ?)',
      [sender_name, sender_email, content]
    );

    res.status(201).json({ 
      success: true, 
      messageId: result.insertId || result[0]?.id 
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all messages
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await db.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark message as read
export const markMessageAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE messages SET is_read = TRUE WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Mark message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete message
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM messages WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
