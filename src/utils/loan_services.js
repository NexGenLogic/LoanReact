import api from './api_services';


export async function fetchLoans(payload) {
  return api.get(`/admin/loans`, { params: payload });
}

export async function fetchLoanUpdates(payload) {
  return api.get(`/admin/loans/update-list`, { params: payload });
}

export async function createLoan(data) {
  return api.post('/admin/loans', data);
}

export async function updateLoan(loan, data) {
  return api.post(`/admin/loans/${loan}`, data);
}

export async function deleteLoan(id) {
  return api.delete(`admin/loans/${id}`);
}

export async function toggleStatus(user, payload) {
  // admin/merchants/:merchantId/toggle-active
  return api.post(`admin/loans/${user}/toggle-active`,payload);
}


export async function storeLoanDocuments(formData, loan ) {
  // admin/merchants/:merchantId/toggle-active
   return api.post(`admin/loans/${loan}/docs`,formData);
}

export async function fetchLoanById(loan) {
  return api.get(`/admin/loans/${loan}`);
}

export async function updateLoanStatus(loanId, data) {
  // This endpoint URL is an example. Adjust it to match your actual API route.
  return api.post(`/admin/loans/${loanId}/status`, data);
}

export async function fetchLoanInstallments(loanId) {
  return api.get(`/admin/loans/${loanId}/installments`);
}

export async function generateLoanSchedule(loanId) {
  return api.get(`/admin/loans/${loanId}/generate-tenure`);
}

export async function submitRepayment(loanId, payload) {
  return api.post(`/admin/loans/${loanId}/payments`, payload);
}

export async function fetchLoanPayments(loanId, params = {}) {
  return api.get(`/admin/loans/${loanId}/payments`, { params });
}

export async function downloadPaymentHistory(loanId, params = {}) {
  const response = await api.get(`/admin/loans/${loanId}/payments/download`, {
    params,
    responseType: 'blob' // For file download
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `loan_${loanId}_payment_history.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export async function addLoanAdjustments(loanId, payload) {
  return api.post(`/admin/loans/${loanId}/adjustments`, payload);
}

export async function deletePayment(payment, loan_id) {
  return api.delete(`admin/loans/${loan_id}/payments/delete/${payment}`);
}

export const requestLoanUpdate = (id, data) => {
    // This assumes your backend will have a new route like:
    // POST /api/v1/loans/{id}/request-update
    return api.post(`admin/loans/${id}/request-update`, data);
};

export const fetchLoanUpdateDetails = (id) => {
    return api.get(`admin/loans/loan-updates/${id}`);
};

export const processLoanUpdate = (id, payload) => {
    return api.post(`admin/loans/loan-updates/${id}/process`, payload);
};

export async function deleteLoanUpdate(updateId) {
  return api.delete(`admin/loans/loan-updates/${updateId}`);
}

export async function submitEarlyClosureMain(loanId, payload) {
  // The backend should provide a dedicated endpoint for early closure, such as /admin/loans/:loanId/early-closure
  return api.post(`/admin/loans/${loanId}/early-closure`, payload);
}
export async function fetchLoanOverdues(formData) {
  return api.post('/admin/dashboard/loan-overdues', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

export async function fetchLoanRepayments(payload) {
  return api.post('/admin/dashboard/repayment-report', payload); // Or your correct route
}