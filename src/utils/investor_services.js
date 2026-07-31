import api from './api_services';


export async function fetchInvestors(payload) {
  return api.get(`/admin/investors`, { params: payload });
}

export async function createInvestor(data) {
  return api.post('/admin/investors/create', data);
}

export async function updateInvestor(user, data) {
  return api.post(`/admin/investors/update/${user}`, data);
}

export async function deleteInvestor(id) {
  return api.delete(`admin/investors/delete/${id}`);
}

export async function toggleStatus(user, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.post(`admin/investors/${user}/toggle-active`,payload);
}

export async function submitInvestment(investorId, payload) {
  return api.post(`/admin/investments/${investorId}/payments`, payload);
}

// in investor_services.js
export async function fetchInvestmentsByInvestor(investor_id) {
    return await api.get(`/admin/investments/${investor_id}/payments`);
}

export async function updateInvestorStatus(investorId, payload) {
  // This now calls the new '/status' endpoint.
  return api.post(`admin/investors/${investorId}/status`, payload);
}

