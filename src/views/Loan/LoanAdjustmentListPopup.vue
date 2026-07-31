<template>
  <div class="adjustment-list-container">
    <!-- Case: No adjustments found -->
    <div v-if="!adjustments || adjustments.length === 0" class="text-center p-4">
      <p class="text-muted">No adjustments have been recorded for this loan.</p>
    </div>

    <!-- Case: Adjustments exist, display in a table -->
    <div v-else class="table-responsive">
      <table class="table table-striped align-items-center mb-0" style="min-height: 20px;">
        <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Description</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Type</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Applied To</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2 text-end">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adj in adjustments" :key="adj.id">
            <td>
              <span class="text-secondary text-xs font-weight-bold">{{ formatDate(adj.adjustment_date) }}</span>
            </td>
            <td>
              <p class="text-xs font-weight-bold mb-0">{{ adj.description }}</p>
            </td>
            <td>
              <span class="text-xs font-weight-bold text-capitalize">{{ formatType(adj.type) }}</span>
            </td>
            <td>
              <span v-if="adj.installment_id" class="text-xs font-weight-bold">
                Installment #{{ findInstallmentNumber(adj.installment_id) }}
              </span>
              <span v-else class="badge badge-sm bg-gradient-info">Loan Level</span>
            </td>
            <td class="text-end" :class="adj.amount >= 0 ? 'text-danger' : 'text-success'">
              <span class="text-xs font-weight-bolder">
                {{ formatCurrency(adj.amount) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoanAdjustmentListPopup",
  props: {
    // Corrected prop name from "adjustmenst" to "adjustments"
    adjustments: {
      type: Array,
      required: true,
      default: () => [],
    },
    // Pass the installments list to find the number
    installments: {
        type: Array,
        required: false,
        default: () => [],
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      // Returns date in a simple "YYYY-MM-DD" format
      return dateString.substring(0, 10);
    },
    formatType(typeString) {
      if (!typeString) return 'N/A';
      // Replaces underscores with spaces for readability, e.g., "late_fee" -> "late fee"
      return typeString.replace(/_/g, ' ');
    },
    formatCurrency(value) {
        const amount = parseFloat(value) || 0;
        // Shows '+' for positive numbers for clarity
        const sign = amount > 0 ? '+' : '';
        return `${sign}${amount.toFixed(2)}`;
    },
    findInstallmentNumber(installmentId) {
        if (!this.installments.length) return installmentId; // Fallback to ID
        const installment = this.installments.find(inst => inst.id === installmentId);
        return installment ? installment.installment_number : installmentId;
    }
  }
};
</script>

<style scoped>
.text-capitalize {
    text-transform: capitalize;
}
.table-responsive {
    max-height: 400px; /* Or any height you prefer for the popup body */
}
</style>
