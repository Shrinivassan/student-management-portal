import path from 'path';
import db from '../configs/db.js';
import fs from 'fs';

function mapFilePath(file, type) {
  if (!file) return null;
  // Store path relative to server root (Uploads/...)
  return path.join('Uploads', type === 'photo' ? 'Photos' : 'Documents', file.filename);
}

export const createStudent = (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || {};
    const photoFile = files.photo && files.photo[0];
    const docFile = files.document && files.document[0];

    if (!body.StudentName) {
      return res.status(400).json({ error: 'StudentName is required' });
    }

    const photoPath = mapFilePath(photoFile, 'photo');
    const documentPath = mapFilePath(docFile, 'document');

    const sql = `INSERT INTO Students (StudentName, Gender, DateOfBirth, MobileNumber, Department, YearOfStudy, RollNumber, PhotoPath, DocumentPath) VALUES (?,?,?,?,?,?,?,?,?)`;
    const params = [
      body.StudentName,
      body.Gender || null,
      body.DateOfBirth || null,
      body.MobileNumber || null,
      body.Department || null,
      body.YearOfStudy || null,
      body.RollNumber || null,
      photoPath,
      documentPath
    ];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const createdId = this.lastID;
      db.get('SELECT * FROM Students WHERE StudentId = ?', [createdId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json(row);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudents = (req, res) => {
  const sql = 'SELECT * FROM Students';
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

export const getStudentById = (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM Students WHERE StudentId = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
};

export const updateStudent = (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};
    const files = req.files || {};
    const photoFile = files.photo && files.photo[0];
    const docFile = files.document && files.document[0];

    // Build update dynamically
    const fields = [];
    const params = [];

    if (body.StudentName) { fields.push('StudentName = ?'); params.push(body.StudentName); }
    if (body.Gender) { fields.push('Gender = ?'); params.push(body.Gender); }
    if (body.DateOfBirth) { fields.push('DateOfBirth = ?'); params.push(body.DateOfBirth); }
    if (body.MobileNumber) { fields.push('MobileNumber = ?'); params.push(body.MobileNumber); }
    if (body.Department) { fields.push('Department = ?'); params.push(body.Department); }
    if (body.YearOfStudy) { fields.push('YearOfStudy = ?'); params.push(body.YearOfStudy); }
    if (body.RollNumber) { fields.push('RollNumber = ?'); params.push(body.RollNumber); }

    if (photoFile) {
      fields.push('PhotoPath = ?');
      params.push(mapFilePath(photoFile, 'photo'));
    }
    if (docFile) {
      fields.push('DocumentPath = ?');
      params.push(mapFilePath(docFile, 'document'));
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const sql = `UPDATE Students SET ${fields.join(', ')} WHERE StudentId = ?`;
    params.push(id);

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM Students WHERE StudentId = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = (req, res) => {
  const id = req.params.id;
  
  // First, get the student to retrieve file paths
  db.get('SELECT * FROM Students WHERE StudentId = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });

    // Delete associated files
    if (row.PhotoPath) {
      const photoPath = path.join(process.cwd(), row.PhotoPath);
      fs.unlink(photoPath, (err) => {
        if (err) console.error('Failed to delete photo:', err);
      });
    }

    if (row.DocumentPath) {
      const docPath = path.join(process.cwd(), row.DocumentPath);
      fs.unlink(docPath, (err) => {
        if (err) console.error('Failed to delete document:', err);
      });
    }

    // Permanently delete the record
    db.run('DELETE FROM Students WHERE StudentId = ?', [id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, message: 'Student and files deleted permanently' });
    });
  });
};

export const downloadFile = (req, res) => {
  try {
    const filePath = req.params.filePath;
    const fullPath = path.join(process.cwd(), filePath);
    
    // Security: ensure the file is within Uploads directory
    const uploadsDir = path.join(process.cwd(), 'Uploads');
    const resolvedPath = path.resolve(fullPath);
    const resolvedUploadsDir = path.resolve(uploadsDir);
    
    if (!resolvedPath.startsWith(resolvedUploadsDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    const fileName = path.basename(fullPath);
    res.download(fullPath, fileName);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
