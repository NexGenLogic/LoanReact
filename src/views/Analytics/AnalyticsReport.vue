<template>
  <div class="container py-4" style="min-height: 750px;">
    <!-- Page Title -->
    
    <!-- Tab Header -->
    <ul class="nav nav-tabs " role="tablist">
      <li class="nav-item" v-for="tab in tabs" :key="tab.value">
        <a  
          class="nav-link"
          :class="{ active: activeTab === tab.value }"
          @click.prevent="activeTab = tab.value"
          href="#"
        >{{ tab.label }}</a>
      </li>
    </ul>

    <div class="tab-content rounded shadow-sm p-3 bg-white">
      <!-- Loan Repayment Status Tab -->
      <div v-if="activeTab === 'repayment'" class="tab-pane active mt-3">
       <RepaymentReportTab></RepaymentReportTab>
      </div>

      <!-- Delinquency Rates Tab -->
      <div v-if="activeTab === 'overdues'" class="tab-pane active mt-3">
        <h5 class="mb-3">Loan Overdues</h5>
        <LoanOverduesTab 
          :initial-date="passedDate" 
          :filter-mode="filterMode">
        </LoanOverduesTab>
        <!-- Insert chart or table here -->
      </div>

      <div v-if="activeTab === 'investment_interest'" class="tab-pane active mt-3">
        <h5 class="mb-3">Interest Payouts</h5>
        <InvestmentInterestPayout></InvestmentInterestPayout>
        <!-- Insert chart or table here -->
      </div>


      <!-- Interest Income Tab -->
      <!-- <div v-if="activeTab === 'income'" class="tab-pane active">
        <h5 class="mb-3">Interest Income</h5>
        <p>
          Analyze interest earned over periods, sources of income, and trends influencing financial returns.
        </p>
        
      </div> -->

      <!-- Risk Exposure Tab -->
      <!-- <div v-if="activeTab === 'risk'" class="tab-pane active">
        <h5 class="mb-3">Risk Exposure</h5>
        <p>
          Review the portfolio’s exposure to credit, market, and interest rate risks, including concentration analysis.
        </p>
      </div> -->
    </div>
  </div>
</template>

<script>
import LoanOverduesTab from "./LoanOverduesTab.vue"
import RepaymentReportTab from "./RepaymentReportTab.vue";
import InvestmentInterestPayout from "./InvestmentInterestPayout.vue";

export default {
  components : {
    LoanOverduesTab,
    RepaymentReportTab,
    InvestmentInterestPayout
  },
  name: 'AnalyticsReport',
  data() {
    return {
      activeTab: 'repayment',
      tabs: [
        { label: 'Repayment Status', value: 'repayment' },
        { label: 'Loan Overdues', value: 'overdues' },
        { label: 'Investment Interest Payouts', value: 'investment_interest' },
        // { label: 'Interest Income', value: 'income' },
        // { label: 'Risk Exposure', value: 'risk' },
      ],
      loanRepaymentData: [
        { id: 'LN-0012', customer: 'Ram Kumar', status: 'Current', dueDate: '2025-11-20', amountDue: '₹18,000' },
        { id: 'LN-0034', customer: 'Kavitha Devi', status: 'Overdue', dueDate: '2025-10-31', amountDue: '₹10,250' }
      ],
      passedDate: null,
      filterMode: null,
      // Add real data sources and methods for charts and advanced analytics
    };
  },
  mounted() {
      // 1. Switch Tab if requested
      if (this.$route.query.tab && this.tabs.some(t => t.value === this.$route.query.tab)) {
        this.activeTab = this.$route.query.tab;
      }

      // 2. Capture Date and Filter Mode if present
      if (this.$route.query.date) {
        this.passedDate = this.$route.query.date;
      }
      if (this.$route.query.filter) {
        this.filterMode = this.$route.query.filter;
      }
    }
};
</script>

<style scoped>
.nav-tabs .nav-link.active {
  background-color: #4ba64f;
  border-color: #419bf1 #419bf1 #fff;
  color: #fff;
}
.table th, .table td {
  vertical-align: middle;
}
.card, .tab-content {
  border-radius: 12px;
}
</style>
