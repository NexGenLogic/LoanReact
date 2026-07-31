<template>
  <div class="py-4 container-fluid" style="min-height: 700px;">
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h4 class="font-weight-bold" style="color: #419bf1;">SPTM Finance</h4>
      </div>
    </div>

    <div class="row">
      <div class="col-12 d-flex justify-content-end align-items-center">
        <h6 class="font-weight-bolder mb-0" style="color: #FFD700;">
          <span class="mx-2 pulse-icon">🪔</span>
           Thamayanthi Govindaraju
          <span class="mx-2 pulse-icon-right">🪔</span>
        </h6>
      </div>
    </div>

    <div class="row mt-2">
      <div class="col-12 d-flex justify-content-between align-items-center flex-wrap" style="gap: 12px;">
        <div>
          <span class="text-secondary text-sm">India (IST):</span>
          <span class="font-weight-bold">{{ istTime }}</span>
        </div>
        <div>
          <span class="text-secondary text-sm">UAE (GST):</span>
          <span class="font-weight-bold">{{ uaeTime }}</span>
        </div>
      </div>
    </div>

    <div class="row my-4">
      <div class="col-lg-4 col-md-6 mb-3">
        <mini-statistics-card
          :title="{ text: 'Active Investments', value: activeInvestments.count }"
          :detail="activeInvestments.detail"
          :icon="{ name: 'trending_up', color: 'text-white', background: 'primary' }"
        />
      </div>
      <div class="col-lg-4 col-md-6 mb-3">
        <mini-statistics-card
          :title="{ text: 'Interest Earned', value: '₹' + interestEarned }"
          :detail="'All time'"
          :icon="{ name: 'signal_cellular_alt', color: 'text-white', background: 'success' }"
        />
      </div>
      <div class="col-lg-4 col-md-6 mb-3">
        <mini-statistics-card
          :title="{ text: 'Next Payout', value: nextPayout.amount ? `₹${nextPayout.amount}` : '-' }"
          :detail="nextPayout.date ? `On ${formatDate(nextPayout.date)}` : '—'"
          :icon="{ name: 'event', color: 'text-white', background: 'warning' }"
        />
      </div>
    </div>
    
    <div class="row mt-4">
        <div class="col-lg-6 mb-4">
            <chart-holder-card 
                title="Investment Growth Over Time" 
                subtitle="Cumulative value of principal invested" 
                color="info"
            >
                <reports-line-chart id="investor-growth-chart" :chart="investmentGrowthChartData" />
            </chart-holder-card>
        </div>

        <div class="col-lg-6 mb-4">
            <chart-holder-card 
                title="Interest Gain Over Time" 
                subtitle="Total interest received per month" 
                color="success"
            >
                <reports-line-chart id="investor-interest-chart" :chart="interestGainChartData" />
            </chart-holder-card>
        </div>
    </div>

  </div>
</template>

<script>
import MiniStatisticsCard from "./components/MiniStatisticsCard.vue";
import ChartHolderCard from "./components/ChartHolderCard.vue"; // NEW
import ReportsLineChart from "@/examples/Charts/ReportsLineChart.vue"; // NEW

import {
  fetchInvestorActiveInvestments,
  fetchInvestorTotalInterest,
  fetchInvestorNextPayout,
  fetchInvestorInvestmentGrowth, // NEW SERVICE
  fetchInvestorInterestGainChart // NEW SERVICE
} from "@/utils/investor_dashboard_services.js";

export default {
  name: "InvestorDashboard",
  components: { 
      MiniStatisticsCard,
      ChartHolderCard, // NEW
      ReportsLineChart, // NEW
  },
  data() {
    return {
      istTime: "",
      uaeTime: "",
      clockIntervalId: null,
      investorName: "Investor",
      activeInvestments: { count: 0, detail: "" },
      interestEarned: 0,
      nextPayout: { amount: null, date: null },
      
      // NEW: Chart data structures
      investmentGrowthChartData: {
        labels: [],
        datasets: [{
          label: "Cumulative Investment Value",
          data: [],
          borderColor: '#11cdef',
          backgroundColor: 'rgba(17, 205, 239, 0.2)',
          fill: true,
          tension: 0.4
        }],
      },
      interestGainChartData: {
        labels: [],
        datasets: [{
          label: "Interest Paid",
          data: [],
          borderColor: '#2dce89', // Success color
          tension: 0.4
        }],
      },
    };
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '—';
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    updateClocks() {
      const now = new Date();
      this.istTime = now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      this.uaeTime = now.toLocaleString('en-GB', { timeZone: 'Asia/Dubai' });
    },
    
    // NEW: Load Interest Gain Chart data
    async loadInterestGainChart() {
        try {
            const response = await fetchInvestorInterestGainChart();
            const data = response.data.data || [];

            this.interestGainChartData = {
                labels: data.map(item => item.month_year),
                datasets: [{
                    label: "Interest Paid",
                    data: data.map(item => item.total_interest),
                    borderColor: '#2dce89',
                    tension: 0.4
                }],
            };
        } catch (error) {
            console.error("Failed to fetch interest gain chart data:", error);
        }
    },
    
    // NEW: Load Investment Growth Chart data
    async loadInvestmentGrowthChart() {
        try {
            const response = await fetchInvestorInvestmentGrowth();
            const data = response.data.data || [];

            this.investmentGrowthChartData = {
                labels: data.map(item => {
                    const date = new Date(item.date);
                    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                }),
                datasets: [{
                    label: "Cumulative Investment Value",
                    data: data.map(item => Number(item.cumulative_amount)),
                    borderColor: '#11cdef',
                    backgroundColor: 'rgba(17, 205, 239, 0.2)',
                    fill: true,
                    tension: 0.4
                }],
            };
        } catch (error) {
            console.error("Failed to fetch investment growth chart data:", error);
        }
    },

    async fetchDashboardData() {
      try {
        const [
          activeInvestmentsRes,
          interestEarnedRes,
          nextPayoutRes
        ] = await Promise.all([
          fetchInvestorActiveInvestments(),
          fetchInvestorTotalInterest(),
          fetchInvestorNextPayout(),
        ]);
        
        // Load Charts Data
        await Promise.all([
            this.loadInvestmentGrowthChart(),
            this.loadInterestGainChart() // CALL NEW CHART FUNCTION
        ]);

        this.activeInvestments.count = activeInvestmentsRes.data.count;
        this.activeInvestments.detail = `Total value: ₹${activeInvestmentsRes.data.total_value}`;
        this.interestEarned = interestEarnedRes.data.amount || 0;
        this.nextPayout.amount = nextPayoutRes.data.amount || null;
        this.nextPayout.date = nextPayoutRes.data.due_date || null;

      } catch (error) {
        console.error("Failed to fetch investor dashboard data", error);
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
};
</script>

<style scoped>
/* ... (Keep existing styles for pulse-icon, etc.) */
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
@keyframes pulse {
  0% { transform: scale(1);}
  50% { transform: scale(1.2);}
  100% { transform: scale(1);}
}
@keyframes pulse-right {
  0% { transform: scale(1) scaleX(-1);}
  50% { transform: scale(1.2) scaleX(-1);}
  100% { transform: scale(1) scaleX(-1);}
}
</style>