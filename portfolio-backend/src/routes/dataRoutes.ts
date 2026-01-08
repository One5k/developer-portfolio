import { Router } from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController';
import {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  getAllMessages,
  createMessage,
  markMessageAsRead,
  deleteMessage,
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/dataController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Projects routes
router.get('/projects', getAllProjects);
router.get('/projects/:id', getProject);
router.post('/projects', authenticate, createProject);
router.put('/projects/:id', authenticate, updateProject);
router.delete('/projects/:id', authenticate, deleteProject);

// Skills routes
router.get('/skills', getAllSkills);
router.get('/skills/:id', getSkill);
router.post('/skills', authenticate, createSkill);
router.put('/skills/:id', authenticate, updateSkill);
router.delete('/skills/:id', authenticate, deleteSkill);

// Experiences routes
router.get('/experiences', getAllExperiences);
router.post('/experiences', authenticate, createExperience);
router.put('/experiences/:id', authenticate, updateExperience);
router.delete('/experiences/:id', authenticate, deleteExperience);

// Certificates routes
router.get('/certificates', getAllCertificates);
router.post('/certificates', authenticate, createCertificate);
router.put('/certificates/:id', authenticate, updateCertificate);
router.delete('/certificates/:id', authenticate, deleteCertificate);

// Messages routes
router.post('/messages', createMessage); // Public
router.get('/messages', authenticate, getAllMessages);
router.put('/messages/:id/read', authenticate, markMessageAsRead);
router.delete('/messages/:id', authenticate, deleteMessage);

// Education routes
router.get('/education', getAllEducation);
router.post('/education', authenticate, createEducation);
router.put('/education/:id', authenticate, updateEducation);
router.delete('/education/:id', authenticate, deleteEducation);

export default router;
