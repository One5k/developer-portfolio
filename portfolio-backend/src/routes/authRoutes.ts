import { Router } from 'express';
import { login, createAdminUser, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);
router.post('/register', createAdminUser); // In production, protect this or remove

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
