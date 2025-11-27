import db from '../configs/db.js';
import bcrypt from 'bcryptjs';

export const ensureUsersTable = (database) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      userType TEXT NOT NULL CHECK(userType IN ('student', 'faculty')),
      name TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  database.run(sql, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
    } else {
      console.log('Users table ensured');
    }
  });
};

export const seedDemoUsers = (database) => {
  // Check if demo users already exist
  database.get(`SELECT COUNT(*) as count FROM users WHERE email IN ('student@example.com', 'faculty@example.com')`, async (err, row) => {
    if (err) {
      console.error('Error checking demo users:', err);
      return;
    }

    if (row && row.count > 0) {
      console.log('Demo users already exist');
      return;
    }

    try {
      const demoUsers = [
        { email: 'student@example.com', password: 'password123', userType: 'student', name: 'Demo Student' },
        { email: 'faculty@example.com', password: 'password123', userType: 'faculty', name: 'Demo Faculty' }
      ];

      for (const user of demoUsers) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        database.run(
          `INSERT INTO users (email, password, userType, name) VALUES (?, ?, ?, ?)`,
          [user.email, hashedPassword, user.userType, user.name],
          (err) => {
            if (err) {
              console.error('Error inserting demo user:', err);
            } else {
              console.log(`Demo user ${user.email} created`);
            }
          }
        );
      }
    } catch (err) {
      console.error('Error seeding demo users:', err);
    }
  });
};

export const createUser = (user) => {
  return new Promise((resolve, reject) => {
    const { email, password, userType, name } = user;
    const sql = `
      INSERT INTO users (email, password, userType, name)
      VALUES (?, ?, ?, ?)
    `;
    db.run(sql, [email, password, userType, name], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, email, userType, name });
      }
    });
  });
};

export const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, email, userType, name, createdAt FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};
