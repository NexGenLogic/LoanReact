import api from './api_services';


export async function fetchPermissions() {
  
  return api.get(`/admin/permissions/permission-list`,);
}

export async function createPermission(data, id) {
  
  return api.post(`admin/merchants/${id}/permissions`, data);
}

export async function updatePermission(id, data) {
  return api.put(`/merchants/permission/update/${id}`, data);
}

export async function deletePermission(id) {
  return api.delete(`admin/merchants/${id}`);
}

export async function toggleStatus(merchant_id, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.patch(`admin/merchants/${merchant_id}/toggle-active`,payload);
}

