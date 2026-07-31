import api from './api_services';


export async function fetchCustomerActiveLoans() {
  return api.get('/admin/customer/dashboard/active-loans');
}

// Get the amount and date of the next due EMI/payment for customer
export async function fetchCustomerNextDue() {
  return api.get('/admin/customer/dashboard/next-due');
}

// Get the count and total amount overdue for customer
export async function fetchCustomerOverdues() {
  return api.get('/admin/customer/dashboard/overdues');
}

// Optionally customer’s profile/name
export async function fetchCustomerProfile() {
  return api.get('/admin/customer/auth/profile');
}
