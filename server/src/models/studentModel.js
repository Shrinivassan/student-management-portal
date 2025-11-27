// studentModel.js - holds table SQL and ensures table exists
export const createStudentsTableSQL = `
CREATE TABLE IF NOT EXISTS Students (
  StudentId INTEGER PRIMARY KEY AUTOINCREMENT,
  StudentName TEXT NOT NULL,
  Gender TEXT,
  DateOfBirth TEXT,
  MobileNumber TEXT,
  Department TEXT,
  YearOfStudy TEXT,
  RollNumber TEXT UNIQUE,  
  PhotoPath TEXT,
  DocumentPath TEXT
);
`;

export function ensureStudentsTable(db) {
  db.run(createStudentsTableSQL, (err) => {
    if (err) {
      console.error('Failed to create Students table', err);
    } else {
      console.log('Students table is ready');
    }
  });
}
