import api from './api_services';
export async function fetchInvestorActiveInvestments() {
  return api.get('/admin/investor/dashboard/active-investments');
}
export async function fetchInvestorTotalInterest() {
  return api.get('/admin/investor/dashboard/interest-earned');
}
export async function fetchInvestorNextPayout() {
  return api.get('/admin/investor/dashboard/next-payout');
}

export async function fetchInvestorInvestmentGrowth() {
  // This uses the dedicated route for the authenticated investor's dashboard
  return api.get(`admin/investor/dashboard/investment-growth`);
}

export async function fetchInvestorInterestGainChart() {
  return api.get(`admin/investor/dashboard/interest-gain-chart`);
}
