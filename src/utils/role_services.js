import api from './api_services';


export async function fetchRoles() {
  return api.get(`/admin/roles`);
}

export async function createRole(data) {
  return api.post('/admin/roles/store', data);
}

export async function deleteRole(id) {
  return api.delete(`admin/roles/delete/${id}`);
}

export async function toggleStatus(role, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.post(`admin/roles/${role}/toggle-active`,payload);
}


export async function fetchPermissions(){
  return api.get('admin/permissions');
}

export async  function updateRole(data){
  return api.post('/admin/roles/update', data);
}

