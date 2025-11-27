import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { ensureStudentsTable } from '../models/studentModel.js';
import { ensureUsersTable, seedDemoUsers } from '../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', '..', 'student.db');
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite DB', err);
    process.exit(1);
  }
  console.log('Connected to SQLite DB at', dbPath);
});

// Ensure tables exist
ensureStudentsTable(db);
ensureUsersTable(db);
seedDemoUsers(db);

export default db;
