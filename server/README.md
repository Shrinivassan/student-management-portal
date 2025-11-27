Server API (SQLite + file uploads)

Endpoints:
POST /student - multipart/form-data with fields and files (photo, document)
GET /student - list active students
GET /student/:id - get one student (active)
PUT /student/:id - update fields and optionally replace files
DELETE /student/:id - soft delete (IsActive = 0)

Uploads are stored under server/Uploads/Photos and server/Uploads/Documents; DB stores relative paths like `Uploads/Photos/<filename>`.

To run:
1. cd server
2. npm install
3. npm start

