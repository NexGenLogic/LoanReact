<template>
  <div v-if="loading" class="text-center p-5">
    <PulseLoader />
  </div>

  <div v-else-if="!loanUpdate" class="text-center p-5">
    <h4 class="text-danger">Loan Update Request Not Found</h4>
    <p>The requested item could not be found. It may have been deleted.</p>
  </div>

  <div v-else class="multisteps-form__panel border-radius-xl p-4" style="max-width: 900px; margin: auto;">
    <div class="multisteps-form__content">
      
      <!-- General Info Accordion -->
      <div class="accordion mb-4">
        <div class="accordion-item border-0 shadow-sm">
          <h5 class="accordion-header bg-gradient-success bg-light rounded-top p-3 d-flex justify-content-between align-items-center text-white text-sm" @click="toggleAccordion('generalInfo')" style="cursor:pointer;">
            <span><i class="material-icons align-middle me-2">info</i>Loan Update Request</span>
            <span :class="{'badge': true, 'bg-gradient-warning': loanUpdate.status === 'pending', 'bg-gradient-success': loanUpdate.status === 'approved', 'bg-gradient-danger': loanUpdate.status === 'rejected'}">{{ loanUpdate.status }}</span>
          </h5>
          <div v-show="accordion.generalInfo" class="accordion-content bg-white px-3 py-3">
            <div class="info-grid">
              <div><strong>Loan ID:</strong> {{ loanUpdate.loan?.loan_identifier }}</div>
              <div><strong>Customer:</strong> {{ loanUpdate.loan?.customer?.name }}</div>
              <div><strong>Requested By:</strong> {{ loanUpdate.updater?.name }}</div>
              <div><strong>Requested At:</strong> {{ formatDate(loanUpdate.created_at) }}</div>
              <div v-if="loanUpdate.status !== 'pending'"><strong>Reviewed By:</strong> {{ loanUpdate.reviewer?.name }}</div>
              <div v-if="loanUpdate.status !== 'pending'"><strong>Reviewed At:</strong> {{ formatDate(loanUpdate.reviewed_at) }}</div>
            </div>
             <div v-if="loanUpdate.status === 'rejected' && loanUpdate.rejection_reason" class="alert alert-danger text-white mt-3 mb-0">
                <strong>Rejection Reason:</strong> {{ loanUpdate.rejection_reason }}
            </div>
          </div>
        </div>
      </div>

      <!-- Proposed Changes Accordion -->
      <div class="accordion mb-4">
        <div class="accordion-item border-0 shadow-sm">
          <h5 class="bg-gradient-success accordion-header bg-light rounded-top p-3 text-white text-sm" @click="toggleAccordion('changes')" style="cursor:pointer;">
            <i class="material-icons align-middle me-2">compare_arrows</i>Details
          </h5>
          <div v-show="accordion.changes" class="accordion-content bg-white px-0 py-0">
            <table class="table table-hover mb-0" v-if="isProfileUpdate">
              <thead class="table-light">
                <tr>
                  <th class="ps-3">Field</th>
                  <th>Original Value</th>
                  <th class="pe-3">Proposed Change</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in changedFields" :key="field.key">
                  <td class="ps-3"><strong>{{ field.label }}</strong></td>
                  <td class="ps-4"><span class="value-original">{{ formatValue(field.key, field.old) }}</span></td>
                  <td class="ps-4"><span class="value-new">{{ formatValue(field.key, field.new) }}</span></td>
                </tr>
              </tbody>
            </table>

            <table v-else class="table table-striped table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-3">Field</th>
                  <th class="pe-3">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="field in newFieldList" :key="field.key">
                  <td class="ps-3"><strong>{{ field.label }}</strong></td>
                  <td class="ps-4">{{ field.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Admin Actions -->
      <div v-if="loanUpdate.status === 'pending'" class="mt-4">
        <div v-if="showRejectionInput" class="mb-3">
          <label for="rejection_reason" class="form-label">Rejection Reason</label>
          <textarea id="rejection_reason" v-model="rejection_reason" class="form-control text-area-rejection" rows="3" placeholder="Please provide a clear reason for rejection..."></textarea>
          <div v-if="rejectionError" class="text-danger text-sm mt-1">{{ rejectionError }}</div>
        </div>
        <div class="d-flex justify-content-end gap-3" v-if="isAdmin()" >
          <material-button v-if="!showRejectionInput" @click="showRejectionInput = true" color="secondary" variant="outline">Reject</material-button>
          <material-button v-if="showRejectionInput" @click="showRejectionInput = false" color="secondary" variant="outline">Cancel</material-button>
          <material-button v-if="showRejectionInput" @click="handleReject" color="danger" variant="gradient">Confirm Rejection</material-button>
          <material-button v-else @click="handleApprove" color="success" variant="gradient">Approve Changes</material-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { fetchLoanUpdateDetails, processLoanUpdate } from "@/utils/loan_services"; // UPDATE YOUR SERVICES FILE
import MaterialButton from "@/components/MaterialButton.vue";
import PulseLoader from "../PulseLoader.vue";
import showSwal from "@/mixins/showSwal.js";
import { isAdmin } from "@/utils/api_services";

export default {
  name: "ViewUpdatedLoanDetailsComponent",
  components: { MaterialButton, PulseLoader },
  data() {
    return {
      loading: true,
      loanUpdateId: this.$route.params.loanId,
      loanUpdate: null,
      originalLoan: null,
      rejection_reason: '',
      rejectionError: '',
      showRejectionInput: false,
      accordion: {
        generalInfo: true,
        changes: true,
      },
    };
  },
  computed: {
    isProfileUpdate() {
      return this.loanUpdate && this.loanUpdate.type === 'profile_update';
    },
     newFieldList() {
      // Returns an array of { key, label, value } to show for non-profile updates
      if (!this.loanUpdate) return [];
      const changes = this.loanUpdate.proposed_changes || {};
      return Object.keys(changes).map(key => ({
        key,
        label: this.formatFieldName(key),
        value: this.formatValue(key, changes[key]),
      }));
    },
    changedFields() {
      if (!this.loanUpdate || !this.originalLoan) return [];
      const changes = this.loanUpdate.proposed_changes;
      return Object.keys(changes).map(key => ({
        key,
        label: this.formatFieldName(key),
        old: this.originalLoan[key],
        new: changes[key],
      }));
    }
  },
  async mounted() {
    this.loadUpdateDetails();
  },
  methods: {
    isAdmin,
    toggleAccordion(section) {
      this.accordion[section] = !this.accordion[section];
    },
    async loadUpdateDetails() {
      this.loading = true;
      try {
        const response = await fetchLoanUpdateDetails(this.loanUpdateId); // Assumes a service function
        this.loanUpdate = response.data.data.update_request;
        this.originalLoan = response.data.data.original_loan;
      } catch (error) {
        showSwal.methods.showSwal({ type: "error", message: "Failed to load update details." });
      } finally {
        this.loading = false;
      }
    },
    async handleApprove() {
        let confirmed = await showSwal.methods.showSwalConfirmationDelete();
        if (confirmed.isConfirmed) {
            this.processRequest('approve');
        }
    },
    async handleReject() {
      this.rejectionError = '';
      if (!this.rejection_reason) {
        this.rejectionError = 'Rejection reason is required.';
        return;
      }
      this.processRequest('reject');
    },
    async processRequest(action) {
        this.loading = true;
        try {
            const payload = {
                action: action,
                rejection_reason: this.rejection_reason
            };
            await processLoanUpdate(this.loanUpdateId, payload); // Assumes a service function
            showSwal.methods.showSwal({ type: "success", message: `Update request successfully ${action}ed!`});
            this.$router.push({ name: 'Loan Updates' }); // Redirect to the list page
        } catch (error) {
          console.error(error)
            const msg = error.raw?.response?.data?.message || `Failed to ${action} the request.`;
            showSwal.methods.showSwal({ type: "error", message: msg });
        } finally {
            this.loading = false;
        }
    },
    formatFieldName(key) {
      return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    },
    formatValue(key, value) {
        if (value === null || value === undefined) return 'N/A';
        if (key.includes('date')) return this.formatDate(value);
        if (key.includes('amount')) return `₹${Number(value).toFixed(2)}`;
        return value;
    },
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
  }
};
</script>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
.value-original {
  color: #e53935; /* Red */
  /* text-decoration: line-through; */
}
.value-new {
  color: #4CAF50; /* Green */
  font-weight: bold;
}
.table th {
  font-weight: 600;
}
.text-area-rejection {
  border : 1px solid #ccc;
  background-color: #fff;
}
</style>
