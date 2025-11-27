const BASE = import.meta.env.VITE_API_BASE || 'https://student-management-portal-eight-hazel.vercel.app';

// Helper to get Authorization header
function getAuthHeader() {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Export BASE for use in components
export const API_BASE = BASE;

async function handleJSONResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

// Auth endpoints
export async function register(email, password, confirmPassword, userType, name) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword, userType, name })
  });
  return handleJSONResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return handleJSONResponse(res);
}

// Student endpoints (authenticated)
export async function getStudents() {
  const res = await fetch(`${BASE}/student`, {
    headers: getAuthHeader()
  });
  return handleJSONResponse(res);
}

export async function getStudent(id) {
  const res = await fetch(`${BASE}/student/${id}`, {
    headers: getAuthHeader()
  });
  return handleJSONResponse(res);
}

export async function createStudent(formData) {
  const res = await fetch(`${BASE}/student`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: formData
  });
  return handleJSONResponse(res);
}

export async function updateStudent(id, formData) {
  const res = await fetch(`${BASE}/student/${id}`, {
    method: 'PUT',
    headers: getAuthHeader(),
    body: formData
  });
  return handleJSONResponse(res);
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE}/student/${id}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  return handleJSONResponse(res);
}

export default { register, login, getStudents, getStudent, createStudent, updateStudent, deleteStudent };
