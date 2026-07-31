import api from './api_services';


export async function fetchInvestments(payload) {
  return api.get(`/admin/investments`, { params: payload });
}

export async function fetchInvestmentUpdates(payload) {
  return api.get(`/admin/investments/update-list`, { params: payload });
}

export async function createInvestment(data) {
  return api.post('/admin/investments', data);
}

export async function updateInvestment(investment, data) {
  return api.post(`/admin/investments/${investment}`, data);
}

export async function deleteInvestment(id) {
  return api.delete(`admin/investments/${id}`);
}

export async function toggleStatus(user, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.post(`admin/investments/${user}/toggle-active`,payload);
}


export async function storeInvestmentDocuments(formData, investmentId) {
  return api.post(`/admin/investments/${investmentId}/docs`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export async function fetchInvestmentById(investmentId) {
  return api.get(`/admin/investments/${investmentId}`);
}

export async function updateInvestmentStatus(investmentId, data) {
  // This endpoint URL is an example. Adjust it to match your actual API route.
  return api.post(`/admin/investments/${investmentId}/status`, data);
}

export async function fetchInvestmentInstallments(investmentId) {
  return api.get(`/admin/investments/${investmentId}/installments`);
}

export async function generateInvestmentSchedule(investmentId) {
  return api.get(`/admin/investments/${investmentId}/generate-tenure`);
}

export async function submitRepayment(investmentId, payload) {
  return api.post(`/admin/investments/${investmentId}/payments`, payload);
}

export async function fetchInvestmentPayments(investmentId, params = {}) {
  return api.get(`/admin/investments/${investmentId}/payments`, { params });
}

export async function downloadPaymentHistory(investmentId, params = {}) {
  const response = await api.get(`/admin/investments/${investmentId}/payments/download`, {
    params,
    responseType: 'blob' // For file download
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `investment_${investmentId}_payment_history.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function addInvestmentAdjustments(investmentId, payload) {
  return api.post(`/admin/investments/${investmentId}/adjustments`, payload);
}

export async function deletePayment(payment, investment_id) {
  return api.delete(`admin/investments/${investment_id}/payments/delete/${payment}`);
}

export const requestInvestmentUpdate = (id, data) => {
    // This assumes your backend will have a new route like:
    // POST /api/v1/investments/{id}/request-update
    return api.post(`admin/investments/${id}/request-update`, data);
};

export const fetchInvestmentUpdateDetails = (id) => {
    return api.get(`admin/investments/investment-updates/${id}`);
};

export const processInvestmentUpdate = (id, payload) => {
    return api.post(`admin/investments/investment-updates/${id}/process`, payload);
};

export async function deleteInvestmentUpdate(updateId) {
  return api.delete(`admin/investments/investment-updates/${updateId}`);
}

export async function fetchInvestmentDocuments(investmentId) {
    return api.get(`/admin/investments/${investmentId}/docs`);
}

export async function deleteInvestmentDocument(investmentId, docId) {
    return api.delete(`/admin/investments/${investmentId}/docs/${docId}`);
}

export const installmentMarkAsPaid = (id) => {
    return api.post(`admin/investments/investment-payouts/${id}/mark-as-paid`);
};

export async function fetchInvestmentPayouts(payload) {
  return api.post('/admin/dashboard/payouts',  payload );
}