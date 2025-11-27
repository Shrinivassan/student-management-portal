import express from 'express';
import { register, login, verifyToken, refreshToken } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/verify', authenticateToken, verifyToken);
router.post('/refresh', authenticateToken, refreshToken);

export default router;
