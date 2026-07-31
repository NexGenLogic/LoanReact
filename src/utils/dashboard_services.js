import api from './api_services'; // Assuming api_services.js is in the same directory

/**
 * Fetch the main KPI values for the dashboard cards.
 */
export async function fetchKpis() {
  // Corresponds to GET /admin/dashboard/kpis
  return api.get('/admin/dashboard/kpis');
}

/**
 * Fetch data for the loan disbursal chart.
 */
export async function fetchLoanDisbursalChart() {
  // Corresponds to GET /admin/dashboard/charts/loan-disbursals
  return api.get('/admin/dashboard/charts/loan-disbursals');
}

/**
 * Fetch data for the monthly repayments chart.
 */
export async function fetchRepaymentsChart() {
  // Corresponds to GET /admin/dashboard/charts/repayments
  return api.get('/admin/dashboard/charts/repayments');
}

/**
 * Fetch data for the new customers growth chart.
 */
export async function fetchNewCustomersChart() {
  // Corresponds to GET /admin/dashboard/charts/new-customers
  return api.get('/admin/dashboard/charts/new-customers');
}

/**
 * Fetch interest earned KPI for active investments.
 */
export async function fetchInterestEarnedKpi() {
  // Corresponds to GET /admin/dashboard/kpis/interest-earned
  return api.get('/admin/dashboard/kpis/interest-earned');
}

/**
 * Fetch interest earned chart data by period.
 * @param {string} period - 'daily', 'monthly', 'quarterly', or 'yearly'
 */
export async function fetchInterestEarnedChart(period = 'daily') {
  // Corresponds to GET /admin/dashboard/charts/interest-earned?period=daily
  return api.get('/admin/dashboard/charts/interest-earned', {
    params: { period }
  });

  
}

export async function fetchAvailableBalanceKpi() {
  return api.get("/admin/dashboard/kpis/available-balance");
}

export function fetchActiveLoansKpi() {
  return api.get('/admin/dashboard/kpis/active-loans');
}
export function fetchTotalInvestmentKpi() {
  return api.get('/admin/dashboard/kpis/total-investment');
}
export function fetchTotalRepaymentKpi() {
  return api.get('/admin/dashboard/kpis/total-repayment');
}
export function fetchDuePaymentsToday() {             // <--- MAKE SURE this exists
  return api.get('/admin/dashboard/payments/due-today');
}

export function fetchOverduePayments() {
  return api.get('/admin/dashboard/payments/overdue');
}

export function fetchUpcomingDisbursements() {
  return api.get('/admin/dashboard/loans/upcoming-disbursements');
}
