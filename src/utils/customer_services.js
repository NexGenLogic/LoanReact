import api from './api_services';


export async function fetchCustomers(payload) {
  return api.get(`/admin/customers`, { params: payload });
}

export async function createCustomer(data) {
  return api.post('/admin/customers/create', data);
}

export async function updateCustomer(user, data) {
  return api.post(`/admin/customers/update/${user}`, data);
}

export async function deleteCustomer(id) {
  return api.delete(`admin/customers/delete/${id}`);
}

export async function toggleStatus(user, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.post(`admin/customers/${user}/toggle-active`,payload);
}

export async function updateCustomerStatus(customerId, payload) {
  // This now calls the new '/status' endpoint.
  return api.post(`admin/customers/${customerId}/status`, payload);
}


