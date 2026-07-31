<template>
  <div class="py-4 container-fluid">
    <!-- Header Text -->
    <div class="row ">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h4 class="font-weight-bold" style="color: #419bf1;">SPTM Finance</h4>
      </div>
    </div>

    <!-- Name Display -->
    <div class="row">
      <div class="col-12 d-flex justify-content-end align-items-center">
        <h6 class="font-weight-bolder mb-0" style="color: #FFD700;">
          <span class="mx-2 pulse-icon">🪔</span>
          Thamayanthi Govindaraju
          <span class="mx-2 pulse-icon-right">🪔</span>
        </h6>
      </div>
    </div>

    <!-- Timezone Display -->
    <div class="row mt-2">
      <div class="col-12 d-flex justify-content-between align-items-center flex-wrap" style="gap: 12px;">
        <div class="d-flex align-items-center time-click" style="gap: 8px;" role="button"
          @click="openDatePicker('istDateInput')">
          <span class="text-secondary text-sm">India (IST)</span>
          <span class="font-weight-bold">{{ istTime }}</span>
          <input ref="istDateInput" type="date" class="visually-hidden-date" aria-label="Pick date for IST" />
        </div>
        <div class="d-flex align-items-center time-click" style="gap: 8px;" role="button"
          @click="openDatePicker('uaeDateInput')">
          <span class="text-secondary text-sm">UAE (GST)</span>
          <span class="font-weight-bold">{{ uaeTime }}</span>
          <input ref="uaeDateInput" type="date" class="visually-hidden-date" aria-label="Pick date for UAE" />
        </div>
      </div>
    </div>




<!-- Quick Actions Section -->
  <div class="row mb-6 mt-4">
    <div class="col-12">
      <div class="card p-3">
        <div class="d-flex align-items-center mb-3">
          <span class="material-icons text-primary me-2">flash_on</span>
          <h5 class="mb-0 font-weight-bold">Quick Actions</h5>
        </div>
        <div class="row justify-content-between">
          <!-- Action Cards -->
          <div class="col-md-2 col-6 mb-3 cursor-pointer "  @click="$router.push({ name: 'CreateEmployee' })" v-if="is_allowed('users','create')">
            <div class="text-center py-3 rounded  bg-gradient-warning shadow-warning text-white" >
              <span class="material-icons" style="font-size:2rem;">person_add</span>
              <div class="mt-2  fw-bold">Add Employee</div>
            </div>
          </div>
          <div class="col-md-2 col-6 mb-3 cursor-pointer"  @click="$router.push({ name: 'CreateLoan' })" v-if="is_allowed('loans','create')">
            <div class="text-center py-3 rounded bg-gradient-success shadow-success text-white" >
              <span class="material-icons" style="font-size:2rem;">work</span>
              <div class="mt-2  fw-bold">Create Loan</div>
            </div>
          </div>
          <div class="col-md-2 col-6 mb-3 cursor-pointer" @click="$router.push({ name: 'CreateCustomer' })" v-if="is_allowed('customers','create')">
            <div class="text-center py-3 rounded bg-gradient-info shadow-info text-white" >
              <span class="material-icons" style="font-size:2rem;">person_add</span>
              <div class="mt-2  fw-bold">Create Customer</div>
            </div>
          </div>
          <div class="col-md-2 col-6 mb-3 cursor-pointer" @click="$router.push({ name: 'CreateInvestment' })" v-if="is_allowed('investments','create')">
            <div class="text-center py-3 rounded bg-gradient-primary shadow-primary text-white" >
              <span class="material-icons" style="font-size:2rem;">insert_chart</span>
              <div class="mt-2  fw-bold">Add Investment</div>
            </div>
          </div>
          <div class="col-md-2 col-6 mb-3 cursor-pointer" @click="$router.push({ name: 'CreateInvestor' })" v-if="is_allowed('investors','create')">
            <div class="text-center py-3 rounded text-white bg-gradient-dark shadow-dark" >
              <span class="material-icons" style="font-size:2rem;">person_add</span>
              <div class="mt-2 fw-bold">Create Investor</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


    <div class="row my-4">
      
      <!-- Portfolio Totals -->
      <div class="col-lg-3 col-md-6 mb-3 cursor-pointer" @click="$router.push({ name: 'Loans' })">
        <mini-statistics-card :title="{ text: 'Active Loans', value: kpis.activeLoans.value }"
          :detail="kpis.activeLoans.detail" :icon="{ name: 'approval', color: 'text-white', background: 'primary' }" />
      </div>
      
      
      <!-- Due Payments (Today) -->
    <div class="col-lg-3 col-md-6 mb-3 cursor-pointer" @click="goToDuePaymentsAnalytics">
    <mini-statistics-card 
      :title="{ text: 'Due Payments (Today)', value: duePayments.count }"
      :detail="duePayments.amount ? '₹' + duePayments.amount : 'No dues'"
      :icon="{ name: 'event', color: 'text-white', background: 'warning' }" 
    />
  </div>
      <!-- Overdue Payments -->
    <div class="col-lg-3 col-md-6 mb-3 cursor-pointer" @click="goToOverduesAnalytics">
      <mini-statistics-card 
        :title="{ text: 'Overdue Payments', value: overdue.count }" 
        :detail="'₹' + overdue.amount"
        :icon="{ name: 'error', color: 'text-white', background: 'danger' }" 
      />
    </div>
      <!-- Upcoming Disbursements -->

      <div class="col-lg-3 col-md-6 col-sm-6">
            <mini-statistics-card
              :title="{ text: 'Total Principal Disbursed', value: kpis.totalPrincipalDisbursed.value }"
              :detail="principalDisbursedDetail" :icon="{ name: 'weekend', color: 'text-white', background: 'dark' }" />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4 cursor-pointer" @click="$router.push({ name: 'Investments' })">
            <mini-statistics-card
              :title="{ text: 'Total Active Investments', value: kpis.totalActiveInvestments.value }"
              :detail="activeInvestmentsDetail"
              :icon="{ name: 'leaderboard', color: 'text-white', background: 'primary' }" />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4 cursor-pointer" @click="$router.push({ name: 'Customers' })">
            <mini-statistics-card :title="{ text: 'New Customers This Month', value: kpis.newCustomersThisMonth.value }"
              :detail="newCustomersDetail" :icon="{ name: 'person', color: 'text-white', background: 'success' }" />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4 cursor-pointer" @click="$router.push({ name: 'Analytics' })">
            <mini-statistics-card
              :title="{ text: 'Repayments Collected (MTD)', value: kpis.repaymentsCollectedMTD.value }"
              :detail="repaymentsCollectedDetail"
              :icon="{ name: 'weekend', color: 'text-white', background: 'info' }" />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-0 mt-4 cursor-pointer" @click="goToInterestEarnedAnalytics">
            <mini-statistics-card :title="{ text: 'Interest Earned', value: kpis.interestEarned.value }"
              :detail="interestEarnedDetail"
              :icon="{ name: 'trending_up', color: 'text-white', background: 'warning' }" />
          </div>
          <div class="col-lg-3 col-md-6 col-sm-6 mt-lg-4 mt-4">
            <mini-statistics-card :title="{ text: 'Available Balance in Finance', value: kpis.availableBalance.value }"
              :detail="availableBalanceDetail"
              :icon="{ name: 'account_balance_wallet', color: 'text-white', background: 'info' }" />
          </div>
          <div class="col-lg-3 col-md-6  mt-lg-4 mt-4">
            <mini-statistics-card :title="{ text: 'Total Investment', value: kpis.totalInvestment.value }"
              :detail="kpis.totalInvestment.detail"
              :icon="{ name: 'account_balance', color: 'text-white', background: 'success' }" />
          </div>

          <div class="col-lg-3 col-md-6 mt-lg-4 mt-4">
            <mini-statistics-card :title="{ text: 'Total Repayment Received', value: kpis.totalRepayment.value }"
              :detail="kpis.totalRepayment.detail" :icon="{ name: 'paid', color: 'text-white', background: 'info' }" />
          </div>

          <div class="col-lg-3 col-md-6 mt-lg-4 mt-4">
           <div  class="card mb-2">
            <div class="card-header p-3 pt-2">
              <div class="icon icon-lg icon-shape shadow text-center border-radius-xl mt-n4 position-absolute bg-gradient-info shadow-info">
                <i class="material-icons opacity-10 text-white" aria-hidden="true">analytics</i>

              </div>
              <div class="pt-1 text-end">
                <p class="text-sm mb-0 text-capitalize">View Analytics</p>
                 <button type="button" class="btn btn-primary btn-sm mt-2" @click="goToAnalytics">
          View Report
        </button>
              </div>
            </div>
            <hr class="dark horizontal my-0"><div class="card-footer p-3 text-end">
              <p class="mb-0"></p></div></div>
          </div>
          
    </div>

    <div class="row mb-4 mt-4">
      <div class="col-lg-12 position-relative z-index-2">

        <div class="row mt-4">
          <!-- Charts -->
          <div class="col-lg-4 col-md-6 mt-4">
            <chart-holder-card title="Loan Disbursals (7 Days)" subtitle="Daily amount disbursed">
              <reports-bar-chart id="disbursals-chart" :chart="loanDisbursalChartData" />
            </chart-holder-card>
          </div>
          <div class="col-lg-4 col-md-6 mt-4">
            <chart-holder-card title="Monthly Repayments" subtitle="Total repayments this year" color="success">
              <reports-line-chart id="repayments-chart" :chart="repaymentsChartData" />
            </chart-holder-card>
          </div>
          <div class="col-lg-4 mt-4">
            <chart-holder-card title="New Customer Growth" subtitle="New customers per month" color="dark">
              <reports-line-chart id="customers-chart" :chart="newCustomersChartData" />
            </chart-holder-card>
          </div>
        </div>

        <div class="row mt-8">
          <div class="col-lg-4">
            <div class="card z-index-2">
              <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2 bg-transparent">
                <div class="border-radius-lg py-3 pe-1 bg-gradient-warning shadow-warning">
                  <reports-line-chart id="interest-earned-chart" :chart="interestEarnedChartData" />
                </div>
              </div>
              <div class="card-body">
                <h6 class="mb-2">Interest Earned Over Time</h6>
                <p class="text-sm mb-3">Interest earned from active investments</p>
                <!-- Tabs -->
                <div class="d-flex gap-2 mb-3">
                  <button type="button" class="btn btn-sm"
                    :class="interestChartPeriod === 'daily' ? 'btn-warning' : 'btn-outline-warning'"
                    @click="changeInterestChartPeriod('daily')">
                    Daily
                  </button>
                  <button type="button" class="btn btn-sm"
                    :class="interestChartPeriod === 'monthly' ? 'btn-warning' : 'btn-outline-warning'"
                    @click="changeInterestChartPeriod('monthly')">
                    Monthly
                  </button>

                  <button type="button" class="btn btn-sm"
                    :class="interestChartPeriod === 'yearly' ? 'btn-warning' : 'btn-outline-warning'"
                    @click="changeInterestChartPeriod('yearly')">
                    Yearly
                  </button>
                </div>
                <hr class="dark horizontal" />
              </div>
            </div>
          </div>
          <div class="col-lg-8 col-md-12 mb-3">
            <div class="col-lg-12 col-md-6 mb-md-0 mb-4">
              <project-card title="Upcoming Loan Disbursements" description="" :headers="['Loan Id', 'Customer', 'Amount','Created By']"
              :projects="formattedUpcomingDisbursements" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      

    </div>
  </div>
</template>

<script>
import ChartHolderCard from "./components/ChartHolderCard.vue";
import ReportsBarChart from "@/examples/Charts/ReportsBarChart.vue";
import ReportsLineChart from "@/examples/Charts/ReportsLineChart.vue";
import MiniStatisticsCard from "./components/MiniStatisticsCard.vue";
import ProjectCard from "./components/ProjectCard.vue";
import { is_allowed } from "@/utils/api_services";

import {
  fetchKpis,
  fetchLoanDisbursalChart,
  fetchRepaymentsChart,
  fetchNewCustomersChart,
  fetchInterestEarnedKpi,
  fetchInterestEarnedChart,
  fetchAvailableBalanceKpi,
  fetchActiveLoansKpi,
  fetchTotalInvestmentKpi,
  fetchTotalRepaymentKpi,
  fetchDuePaymentsToday,
  fetchOverduePayments,
  fetchUpcomingDisbursements
} from "@/utils/dashboard_services.js";

export default {
  name: "DashBoard",
  components: {
    ChartHolderCard,
    ReportsBarChart,
    ReportsLineChart,
    MiniStatisticsCard,
    ProjectCard,

  },
  data() {
    return {
      istTime: "",
      uaeTime: "",
      clockIntervalId: null,
      kpis: {
        totalPrincipalDisbursed: { value: "₹0", change: 0 },
        totalActiveInvestments: { value: "₹0", change: 0 },
        newCustomersThisMonth: { value: "0", change: 0 },
        repaymentsCollectedMTD: { value: "₹0", change: 0 },
        interestEarned: { value: "₹0", change: 0 },
        availableBalance: { value: "₹0", change: 0 },
        activeLoans: { value: 0, detail: "" },
        totalInvestment: { value: "₹0", detail: "" },
        totalRepayment: { value: "₹0", detail: "" },
      },
      duePayments: { count: 0, amount: 0 },
      overdue: { count: 0, amount: 0 },
      upcomingDisbursements: [
        // { id, date, loan_identifier, amount }
      ],
      interestChartPeriod: 'monthly',
      interestEarnedChartData: {
        labels: [],
        datasets: [{
          label: "Interest Earned",
          data: [],
          borderColor: '#fb6340',
        }],
      },
      loanDisbursalChartData: {
        labels: [],
        datasets: [{
          label: "Disbursed",
          data: [],
          backgroundColor: '#F5365C',
        }],
      },
      repaymentsChartData: {
        labels: [],
        datasets: [{
          label: "Repayments",
          data: [],
        }],
      },
      newCustomersChartData: {
        labels: [],
        datasets: [{
          label: "New Customers",
          data: [],
        }],
      },
    };
  },
  computed: {
    formattedUpcomingDisbursements() {
      return this.upcomingDisbursements.map(item => ({
        title: item.loan_identifier,
        members: (item.customer && item.customer.name) || 'Unknown',
        budget: this.formatCurrency(item.principal_amount),
        id : item.id,
        created_by : item.creator.name
      }));
    },
    principalDisbursedDetail() {
      return this.formatDetail(this.kpis.totalPrincipalDisbursed.change, "last week");
    },
    activeInvestmentsDetail() {
      return this.formatDetail(this.kpis.totalActiveInvestments.change, "last month");
    },
    newCustomersDetail() {
      return this.formatDetail(this.kpis.newCustomersThisMonth.change, "yesterday");
    },
    repaymentsCollectedDetail() {
      return this.formatDetail(this.kpis.repaymentsCollectedMTD.change, "last month");
    },
    interestEarnedDetail() {
      return this.formatDetail(this.kpis.interestEarned.change, "last month");
    },
    availableBalanceDetail() {
      return `
        <span style="display:inline-block;width:16px;height:16px;border-radius:50%;vertical-align:middle;background:${this.availableBalanceStatus.color};margin-right:8px"></span>
        <span style="vertical-align:middle;color:#6c7a89;">${this.availableBalanceStatus.text}</span>
      `;
    },
    availableBalanceStatus() {
      const available = Number(this.kpis.availableBalance.value.toString().replace(/[₹,k]/g, ''));
      const totalInvestment = Number(this.kpis.totalActiveInvestments.value.toString().replace(/[₹,k]/g, ''));
      if (totalInvestment === 0) return { color: 'gray', text: 'N/A' };

      const ratio = available / totalInvestment;
      if (ratio >= 0.75) return { color: '#1cc88a', text: 'Healthy liquidity' };   // green
      if (ratio >= 0.4) return { color: '#f6c41e', text: 'Moderate liquidity' };  // yellow
      return { color: '#e74c3c', text: 'Low liquidity' };                         // red
    }

  },
  methods: {
    is_allowed,
    goToInterestEarnedAnalytics() {
      this.$router.push({ 
        name: 'Analytics', 
        query: { 
          tab: 'investment_interest' // Switch to Interest Earned tab
        } 
      });
    },
    goToDuePaymentsAnalytics() {
      // 1. Get Today's Date in YYYY-MM-DD format
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];

      // 2. Navigate with query parameters
      this.$router.push({ 
        name: 'Analytics', 
        query: { 
          tab: 'overdues',       // Switch to correct tab
          date: formattedDate,   // Pass the date
          filter: 'due_today'    // Optional: flag to tell the tab to filter specifically for today
        } 
      });
    },
    goToAnalytics() {
      this.$router.push({ name: 'Analytics' }); // Replace 'Analytics' with your actual route name/path
    },
    goToOverduesAnalytics() {
      this.$router.push({ 
        name: 'Analytics', 
        query: { tab: 'overdues' } // This passes a signal to the next page
      });
    },
    calculateAvailableBalance(kpiData) {
      const totalCapital = Number(kpiData.totalCapital || 0);
      const interestEarned = Number(kpiData.interestEarned || 0);
      const investedAmount = Number(kpiData.investedAmount || 0);
      const withdrawals = Number(kpiData.withdrawals || 0);

      return totalCapital + interestEarned - (investedAmount + withdrawals);
    },
    updateClocks() {
      const now = new Date();
      this.istTime = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      this.uaeTime = now.toLocaleString('en-GB', {
        timeZone: 'Asia/Dubai',
        hour12: true,
        year: 'numeric', month: 'short', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    },
    openDatePicker(refName) {
      const input = this.$refs[refName];
      if (!input) return;
      if (typeof input.showPicker === 'function') {
        input.showPicker();
      } else {
        input.click();
      }
    },
    formatDetail(change, period) {
      if (change === null || change === 0) {
        return `<span>No change from ${period}</span>`;
      }
      const sign = change > 0 ? "+" : "";
      const color = change > 0 ? "text-success" : "text-danger";
      return `<span class='${color} text-sm font-weight-bolder'>${sign}${change}%</span> than ${period}`;
    },
    formatCurrency(value) {
      if (!value) return "₹0";
      if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
      return `₹${value}`;
    },
    async fetchDashboardData() {
      try {
        const kpiResponse = await fetchKpis();
        const kpiData = kpiResponse.data;

        const availableBalance = this.calculateAvailableBalance({
          totalCapital: kpiData.totalCapital,
          interestEarned: kpiData.interestEarned,
          investedAmount: kpiData.investedAmount,
          withdrawals: kpiData.withdrawals
        });

        const [
          activeLoansRes,
          totalInvestmentRes,
          totalRepaymentRes,
          duePaymentsRes,
          overdueRes,
          upcomingRes
        ] = await Promise.all([
          fetchActiveLoansKpi(),
          fetchTotalInvestmentKpi(),
          fetchTotalRepaymentKpi(),
          fetchDuePaymentsToday(),
          fetchOverduePayments(),
          fetchUpcomingDisbursements(),
        ]);

        this.kpis.availableBalance.value = this.formatCurrency(availableBalance);
        this.kpis.availableBalance.change = 0;
        this.kpis.totalPrincipalDisbursed = { value: this.formatCurrency(kpiData.totalPrincipalDisbursed.value), change: kpiData.totalPrincipalDisbursed.change };
        this.kpis.totalActiveInvestments = { value: this.formatCurrency(kpiData.totalActiveInvestments.value), change: kpiData.totalActiveInvestments.change };
        this.kpis.newCustomersThisMonth = { value: kpiData.newCustomersThisMonth.value.toString(), change: kpiData.newCustomersThisMonth.change };
        this.kpis.repaymentsCollectedMTD = { value: this.formatCurrency(kpiData.repaymentsCollectedMTD.value), change: kpiData.repaymentsCollectedMTD.change };
        this.kpis.activeLoans.value = activeLoansRes.data.count;
        this.kpis.activeLoans.detail = "Total value: ₹" + this.formatCurrency(activeLoansRes.data.total_value);
        this.kpis.totalInvestment.value = "" + this.formatCurrency(totalInvestmentRes.data.sum);
        this.kpis.totalInvestment.detail = "";
        this.kpis.totalRepayment.value = this.formatCurrency(totalRepaymentRes.data.total_repaid);
        this.kpis.totalRepayment.detail = "";
        this.duePayments.count = duePaymentsRes.data.count;
        this.duePayments.amount = duePaymentsRes.data.amount;
        this.overdue.count = overdueRes.data.count;
        this.overdue.amount = overdueRes.data.sum;
        this.upcomingDisbursements = upcomingRes.data.disbursements;

        const [disbursalRes, repaymentsRes, customersRes] = await Promise.all([
          fetchLoanDisbursalChart(),
          fetchRepaymentsChart(),
          fetchNewCustomersChart()
        ]);

        try {
          const response = await fetchAvailableBalanceKpi();
          const balance = response.data.available_balance;
          this.kpis.availableBalance.value = this.formatCurrency(balance);
          this.kpis.availableBalance.change = 0; // set from previous value if needed
        } catch (error) {
          this.kpis.availableBalance.value = "₹0";
        }

        this.loanDisbursalChartData = {
          labels: disbursalRes.data.map(item => new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })),
          datasets: [{
            label: "Disbursed",
            data: disbursalRes.data.map(item => Number(item.total)),
            backgroundColor: '#F5365C',
          }]
        };

        this.repaymentsChartData = {
          labels: repaymentsRes.data.map(item => item.month),
          datasets: [{
            label: "Repayments",
            data: repaymentsRes.data.map(item => Number(item.total)),
            borderColor: '#2dce89',
          }]
        };

        this.newCustomersChartData = {
          labels: customersRes.data.map(item => item.month),
          datasets: [{
            label: "New Customers",
            data: customersRes.data.map(item => Number(item.count)),
            borderColor: '#344767'
          }]
        };

        // Fetch interest earned KPI and chart
        try {
          // First try to fetch KPI
          try {
            const interestKpiRes = await fetchInterestEarnedKpi();
            // Handle different API response structures
            const interestKpiData = interestKpiRes.data?.data || interestKpiRes.data || {};

            // Extract value and change, handling different possible structures
            const interestValue = interestKpiData.value || interestKpiData.interest_earned || interestKpiData.total || 0;
            const interestChange = interestKpiData.change || interestKpiData.change_percent || 0;

            if (interestValue > 0) {
              this.kpis.interestEarned = {
                value: this.formatCurrency(interestValue),
                change: interestChange
              };
            }
          } catch (kpiError) {
            console.warn("KPI endpoint failed, will calculate from chart data:", kpiError);
          }

          // Fetch monthly chart data to calculate current month's interest
          // Load monthly data first to populate the widget
          await this.loadInterestEarnedChart('monthly');

          // If KPI is still 0, try to get it from the chart data (already done in loadInterestEarnedChart for monthly)
          // Now switch to daily view if needed, but keep monthly as initial period
          if (this.kpis.interestEarned.value === '₹0' && this.interestChartPeriod === 'daily') {
            // Switch back to monthly to keep consistency
            this.interestChartPeriod = 'monthly';
          }
        } catch (interestError) {
          console.error("Failed to fetch interest earned data:", interestError);
          console.error("Error details:", interestError.response?.data || interestError.message);
          // Keep default values if fetch fails
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    },
    async changeInterestChartPeriod(period) {
      this.interestChartPeriod = period;
      await this.loadInterestEarnedChart(period);
    },
    async loadInterestEarnedChart(period) {
      try {
        const response = await fetchInterestEarnedChart(period);
        const data = response.data || response.data?.data || [];

        // Format labels based on period
        let labels = [];
        let chartDataValues = [];

        if (period === 'daily') {
          labels = data.map(item => {
            const date = new Date(item.date || item.day);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          });
          chartDataValues = data.map(item => Number(item.amount || item.total || item.value || 0));
        } else if (period === 'monthly') {
          labels = data.map(item => item.month || item.label || item.period);
          chartDataValues = data.map(item => Number(item.amount || item.total || item.value || 0));

          // Calculate current month's interest from monthly data
          const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
          const currentMonthShort = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

          // Find current month in data
          const currentMonthData = data.find(item => {
            const itemMonth = (item.month || item.label || item.period || '').toLowerCase();
            return itemMonth.includes(currentMonth.toLowerCase()) ||
              itemMonth.includes(currentMonthShort.toLowerCase()) ||
              itemMonth === new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
          });

          if (currentMonthData) {
            const currentMonthValue = Number(currentMonthData.amount || currentMonthData.total || currentMonthData.value || 0);
            // Update KPI if we found current month data
            if (currentMonthValue > 0) {
              // Check if KPI is 0 or empty
              const currentKpiValue = this.kpis.interestEarned.value;
              const isKpiZero = !currentKpiValue || currentKpiValue === '₹0' || currentKpiValue === '0' || Number(currentKpiValue.replace('₹', '').replace('k', '')) === 0;

              if (isKpiZero) {
                // Get previous month for change calculation
                const previousMonthIndex = data.indexOf(currentMonthData) - 1;
                let changePercent = 0;

                if (previousMonthIndex >= 0 && data[previousMonthIndex]) {
                  const previousValue = Number(data[previousMonthIndex].amount || data[previousMonthIndex].total || data[previousMonthIndex].value || 0);
                  if (previousValue > 0) {
                    changePercent = ((currentMonthValue - previousValue) / previousValue) * 100;
                  }
                }

                this.kpis.interestEarned = {
                  value: this.formatCurrency(currentMonthValue),
                  change: changePercent
                };
              }
            }
          } else {
            // If current month not found, use the most recent month's value or sum all as fallback
            const currentKpiValue = this.kpis.interestEarned.value;
            const isKpiZero = !currentKpiValue || currentKpiValue === '₹0' || currentKpiValue === '0' || Number(currentKpiValue.replace('₹', '').replace('k', '')) === 0;

            if (chartDataValues.length > 0 && isKpiZero) {
              // Use the last (most recent) month's value
              const mostRecentValue = chartDataValues[chartDataValues.length - 1];
              if (mostRecentValue > 0) {
                // Calculate change from previous month if available
                let changePercent = 0;
                if (chartDataValues.length > 1) {
                  const previousValue = chartDataValues[chartDataValues.length - 2];
                  if (previousValue > 0) {
                    changePercent = ((mostRecentValue - previousValue) / previousValue) * 100;
                  }
                }

                this.kpis.interestEarned = {
                  value: this.formatCurrency(mostRecentValue),
                  change: changePercent
                };
              }
            }
          }
        } else if (period === 'quarterly') {
          labels = data.map(item => item.quarter || item.label);
          chartDataValues = data.map(item => Number(item.amount || item.total || item.value || 0));
        } else if (period === 'yearly') {
          labels = data.map(item => item.year || item.label);
          chartDataValues = data.map(item => Number(item.amount || item.total || item.value || 0));
        }

        this.interestEarnedChartData = {
          labels: labels,
          datasets: [{
            label: "Interest Earned",
            data: chartDataValues,
            borderColor: '#fb6340',
            backgroundColor: 'rgba(251, 99, 64, 0.1)',
            tension: 0.4
          }]
        };
      } catch (error) {
        console.error("Failed to fetch interest earned chart data:", error);
        // Set empty chart on error
        this.interestEarnedChartData = {
          labels: [],
          datasets: [{
            label: "Interest Earned",
            data: [],
            borderColor: '#fb6340',
          }]
        };
      }
    }
  },
  mounted() {
    this.updateClocks();
    this.clockIntervalId = setInterval(this.updateClocks, 1000);
    this.fetchDashboardData();
  },
  beforeUnmount() {
    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId);
      this.clockIntervalId = null;
    }
  }
}
</script>

<style scoped>
@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes pulse-right {
  0% {
    transform: scale(1) scaleX(-1);
  }

  50% {
    transform: scale(1.2) scaleX(-1);
  }

  100% {
    transform: scale(1) scaleX(-1);
  }
}

.pulse-icon,
.pulse-icon-right {
  animation-duration: 2s;
  animation-iteration-count: infinite;
  display: inline-block;
}

.pulse-icon {
  animation-name: pulse;
}

.pulse-icon-right {
  animation-name: pulse-right;
}

.time-click {
  cursor: pointer;
}

.visually-hidden-date {
  position: absolute;
  width: 0;
  height: 0;
  padding: 0;
  margin: 0;
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  overflow: hidden;
}

.health-indicator {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #eee;
  margin-right: 4px;
}

.health-indicator-container {
  position: relative;
  top: -28px;
  /* or as needed */
  left: 16px;
  /* adjust as needed */
}
</style>
