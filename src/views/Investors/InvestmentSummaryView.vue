<template>
  <div>
    <div v-if="loading" class="text-center p-2">
      <PulseLoader />
    </div>
    <div v-else-if="investments.length === 0">
      <div class="text-center text-muted p-4">No investments found.</div>
    </div>
    <div v-else>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date</th>
            <th>Method</th>
            <th>Reference</th>
            <th>Doc</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in investments" :key="inv.id">
            <td>{{ inv.amount }}</td>
            <td>{{ inv.payment_date }}</td>
            <td>{{ inv.payment_method }}</td>
            <td>{{ inv.reference_number || '-' }}</td>
            <td>
              <span v-if="inv.reference">
                <a :href="getReferenceUrl(inv.reference)" target="_blank" rel="noopener noreferrer" title="View Reference Document">
                  <i class="fas fa-eye"></i> <!-- Use Font Awesome or similar for the eye icon; include the library if not already -->
                </a>
              </span>
              <span v-else>{{ inv.reference_number || '-' }}</span>
            </td>
          </tr>
           <tr class="table-summary">
            <td colspan="4">Total Amount</td>
            <td><strong>{{ totalAmount }}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import PulseLoader from "../PulseLoader.vue";
import { fetchInvestmentsByInvestor } from "@/utils/investor_services";

export default {
  name: 'InvestmentSummaryView',
  components: { PulseLoader },
  props: {
    investor: { type: Object, required: true }
  },
  data() {
    return { investments: [], loading: false }
  },
  methods: {
    getReferenceUrl(reference) {
      // Adjust base URL as needed (e.g., 'https://your-domain.com/' + reference)
      return reference; // Or prepend base: return `${process.env.VUE_APP_API_BASE_URL}/${reference}`;
    }
  },
  computed: {
    totalAmount() {
      return this.investments.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0).toFixed(2);
    }
  },
  async mounted() {
    this.loading = true;
    try {
      // implement fetchInvestmentsByInvestor in your API utils
      const res = await fetchInvestmentsByInvestor(this.investor.id);
      this.investments = res.data.message && res.data.message.investments ? res.data.message.investments : []; // or as per your API
    } catch (e) {
      this.investments = [];
    }
    this.loading = false;
  }
}
</script>

<style scoped>

.table-summary {
  font-weight: bold;
  background-color: #f8f9fa; /* Optional: Light background for emphasis */
}
</style>
