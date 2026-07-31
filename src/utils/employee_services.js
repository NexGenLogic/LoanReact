import api from './api_services';


export async function fetchEmployees(payload) {
  return api.get(`/admin/users`, { params: payload });
}

export async function createEmployee(data) {
  return api.post('/admin/users/create', data);
}

export async function updateEmployee(user, data) {
  return api.post(`/admin/users/update/${user}`, data);
}

export async function deleteEmployee(id) {
  return api.delete(`admin/users/delete/${id}`);
}

export async function toggleStatus(user, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.post(`admin/users/${user}/toggle-active`,payload);
}


