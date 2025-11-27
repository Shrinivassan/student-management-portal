import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { authenticateToken } from './middleware/auth.js';
// initialize DB (ensure models table created)
import './configs/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically at /Uploads
app.use('/Uploads', express.static(path.join(__dirname, '..', 'Uploads')));

// Auth APIs (public)
app.use('/auth', authRoutes);

// Student APIs (protected)
app.use('/student', authenticateToken, studentRoutes);

// Basic health
app.get('/', (req, res) => res.json({ ok: true }));

export default app;
