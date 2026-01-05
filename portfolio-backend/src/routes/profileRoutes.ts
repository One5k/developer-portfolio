import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getHeroSection,
  updateHeroSection,
  getAboutSection,
  updateAboutSection,
} from '../controllers/profileController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', authenticate, updateProfile);

// Hero section routes
router.get('/hero', getHeroSection);
router.put('/hero', authenticate, updateHeroSection);

// About section routes
router.get('/about', getAboutSection);
router.put('/about', authenticate, updateAboutSection);

export default router;
