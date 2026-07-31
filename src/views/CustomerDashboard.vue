<template>
  <div class="py-4 container-fluid" style="min-height: 700px;">
    <!-- Header Text -->
    <div class="row">
      <div class="col-12 d-flex justify-content-center align-items-center">
        <h4 class="font-weight-bold" style="color: #419bf1;">SPTM Finance</h4>
      </div>
    </div>

    <!-- Customer Name (Optionally bind to user)-->
    <div class="row">
      <div class="col-12 d-flex justify-content-end align-items-center">
        <h6 class="font-weight-bolder mb-0" style="color: #FFD700;">
          <span class="mx-2 pulse-icon">🪔</span>
          Thamayanthi Govindaraju
          <span class="mx-2 pulse-icon-right">🪔</span>
        </h6>
      </div>
    </div>

    <!-- Times (Optional) -->
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

    <!-- Core KPIs for customer -->
    <div class="row my-4">
      <!-- Active Loans Widget -->
      <div class="col-lg-4 col-md-6 mb-3">
        <mini-statistics-card
          :title="{ text: 'Active Loans', value: activeLoans.count }"
          :detail="activeLoans.detail"
          :icon="{ name: 'approval', color: 'text-white', background: 'primary' }"
        />
      </div>
      <!-- Next Due Payment -->
      <div class="col-lg-4 col-md-6 mb-3">
        <mini-statistics-card
          :title="{ text: 'Next Due Payment', value: nextDue.amount ? `₹${nextDue.amount}` : 0 }"
          :detail="nextDue.date ? `Due on ${ formatDate(nextDue.date)}` : '—'"
          :icon="{ name: 'event', color: 'text-white', background: 'warning' }"
        />
      </div>
      <!-- Overdue Payments Widget -->
      <div class="col-lg-4 col-md-6 mb-3">
        <mini-statistics-card
          :title="{ text: 'Overdue Payments', value: overdue.count }"
          :detail="overdue.amount ? `₹${overdue.amount}` : 'No overdue'"
          :icon="{ name: 'error', color: 'text-white', background: 'danger' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MiniStatisticsCard from "./components/MiniStatisticsCard.vue";
import { fetchCustomerActiveLoans, fetchCustomerNextDue, fetchCustomerOverdues } from "@/utils/customer_dashboard_services.js";

export default {
  name: "CustomerDashboard",
  components: { MiniStatisticsCard },
  data() {
    return {
      istTime: "",
      uaeTime: "",
      clockIntervalId: null,
      activeLoans: { count: 0, detail: "" },
      nextDue: { amount: null, date: null },
      overdue: { count: 0, amount: 0 }
    };
  },
  methods: {
    formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    // Output: 18-Dec-2025
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
    async fetchDashboardData() {
      try {
        // Optionally fetch customer profile/name
       

        // Fetch KPIs
        const [activeLoansRes, nextDueRes, overdueRes] = await Promise.all([
          fetchCustomerActiveLoans(),
          fetchCustomerNextDue(),
          fetchCustomerOverdues()
        ]);
        // Set data
        this.activeLoans.count = activeLoansRes.data.count;
        this.activeLoans.detail = `Total value: ₹${activeLoansRes.data.total_value}`;
        this.nextDue.amount = nextDueRes.data.amount || null;
        this.nextDue.date = nextDueRes.data.due_date || null;
        this.overdue.count = overdueRes.data.count;
        this.overdue.amount = overdueRes.data.amount;

      } catch (error) {
        // Handle errors gracefully
        console.error("Failed to fetch customer dashboard data", error);
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
