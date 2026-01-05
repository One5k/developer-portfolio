import { Request, Response } from 'express';
import { db } from '../config/database';

// Get all projects
// Get all projects
export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    
    // Fetch skills for each project
    const projectsWithSkills = await Promise.all(projects.map(async (project: any) => {
      const skills = await db.query(
        `SELECT s.name_en FROM skills s 
         INNER JOIN project_skills ps ON s.id = ps.skill_id 
         WHERE ps.project_id = ?`,
        [project.id]
      );
      
      return {
        ...project,
        technologies: skills.map((s: any) => s.name_en)
      };
    }));

    res.json({ projects: projectsWithSkills });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single project
export const getProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const projects = await db.query('SELECT * FROM projects WHERE id = ? LIMIT 1', [id]);
    
    if (projects.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Get associated skills
    const skills = await db.query(
      `SELECT s.* FROM skills s 
       INNER JOIN project_skills ps ON s.id = ps.skill_id 
       WHERE ps.project_id = ?`,
      [id]
    );

    res.json({ project: { ...projects[0], skills } });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create project
export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      category,
      image_url,
      live_url,
      github_url,
      is_featured,
      skill_ids,
    } = req.body;

    const result = await db.query(
      `INSERT INTO projects 
      (title_en, title_ar, description_en, description_ar, category, image_url, live_url, github_url, is_featured) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title_en, title_ar, description_en, description_ar, category, image_url, live_url, github_url, is_featured || false]
    );

    const projectId = result.insertId || result[0]?.id;

    // Link skills if provided
    if (skill_ids && Array.isArray(skill_ids) && skill_ids.length > 0) {
      for (const skillId of skill_ids) {
        await db.query(
          'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)',
          [projectId, skillId]
        );
      }
    }

    res.status(201).json({ success: true, projectId });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      category,
      image_url,
      live_url,
      github_url,
      is_featured,
      skill_ids,
    } = req.body;

    await db.query(
      `UPDATE projects SET 
      title_en = ?, title_ar = ?, description_en = ?, description_ar = ?, 
      category = ?, image_url = ?, live_url = ?, github_url = ?, is_featured = ? 
      WHERE id = ?`,
      [title_en, title_ar, description_en, description_ar, category, image_url, live_url, github_url, is_featured || false, id]
    );

    // Update skills
    if (skill_ids && Array.isArray(skill_ids)) {
      await db.query('DELETE FROM project_skills WHERE project_id = ?', [id]);
      
      for (const skillId of skill_ids) {
        await db.query(
          'INSERT INTO project_skills (project_id, skill_id) VALUES (?, ?)',
          [id, skillId]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM projects WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
