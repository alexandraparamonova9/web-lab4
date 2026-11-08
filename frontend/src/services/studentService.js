import { apiRequest } from './api.js'
const baseUrl = '/api/students'

export function getStudents(filters = {}, signal) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== '' && value !== null && value !== undefined) query.set(key, String(value).trim())
  }
  return apiRequest(`${baseUrl}/search?${query}`, { signal })
}
export function getStudentById(id, signal) {
  return apiRequest(`${baseUrl}/${id}`, { signal })
}
export function addStudent(student) {
  return apiRequest(baseUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) })
}
export function updateStudent(id, student) {
  return apiRequest(`${baseUrl}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(student) })
}
export function deleteStudent(id) {
  return apiRequest(`${baseUrl}/${id}`, { method: 'DELETE' })
}
