import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import * as studentController from '../controllers/studentController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Multer storage - route files by fieldname
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(__dirname, '..', '..', 'Uploads');
    const dest = file.fieldname === 'photo' ? path.join(base, 'Photos') : path.join(base, 'Documents');
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '';
    cb(null, unique + ext);
  }
});

const upload = multer({ storage });

// Create student with photo and document
router.post('/', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'document', maxCount: 1 }]), studentController.createStudent);

// Get list of active students
router.get('/', studentController.getStudents);

// Get one student by id
router.get('/:id', studentController.getStudentById);

// Update student (allow replacing files)
router.put('/:id', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'document', maxCount: 1 }]), studentController.updateStudent);

// Soft delete student
router.delete('/:id', studentController.deleteStudent);

// Download file endpoint
router.get('/download/:filePath(*)', studentController.downloadFile);

export default router;
