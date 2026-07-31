<template>
  <!-- Use size="sm" for a smaller modal -->
  <BaseModal ref="statusModal" modal-id="changeStatusModal" size="sm">
    <template #header>
      <h5 class="modal-title">Change Loan Status</h5>
      <button type="button" class="btn-close" @click="close" aria-label="Close"></button>
    </template>

    <!-- The form now uses Bootstrap's grid system -->
    <form v-if="loan" @submit.prevent="saveStatus">
      <!-- Row 1: Status Dropdown -->
      <div class="row align-items-center mb-3">
        <div class="col-4">
          <label for="loan-status" class="col-form-label fw-bold">Status:</label>
        </div>
        <div class="col-8">
          <select id="loan-status" class="form-select" v-model="formData.status" required>
            <option disabled value="">-- Select --</option>
            <option v-for="statusOption in statuses" :key="statusOption.value" :value="statusOption.value">
              {{ statusOption.label }}
            </option>
          </select>
        </div>
      </div>

      <!-- Row 2: Notes Textarea -->
      <div class="row align-items-start"> <!-- Use align-items-start for better label alignment with textarea -->
        <div class="col-4">
          <label for="status-note" class="col-form-label fw-bold">Note:</label>
        </div>
        <div class="col-8">
          <textarea id="status-note" class="form-control" rows="3" v-model="formData.notes" placeholder="Optional..."></textarea>
        </div>
      </div>
    </form>
    <div v-else class="text-center">
      <p>Loading...</p>
    </div>

    <template #footer>
      <!-- Row 3: Buttons (inside the footer slot) -->
      <button type="button" class="btn btn-secondary" @click="close">Cancel</button>
      <button type="button" class="btn btn-success" @click="saveStatus" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        {{ loading ? 'Saving...' : 'Save' }}
      </button>
    </template>
  </BaseModal>
</template>

<script>
// The <script> section remains the same as the previous answer.
// No changes are needed there.
import BaseModal from './BaseModal.vue';
import { updateLoanStatus } from '@/utils/loan_services';

export default {
  name: 'ChangeStatusModal',
  components: {
    BaseModal
  },
  props: {
    loan: {
      type: Object,
      default: () => null
    }
  },
  emits: ['status-updated'],
  data() {
    return {
      loading: false,
      formData: {
        status: '',
        notes: ''
      },
      statuses: [
        { value: 'pending_approval', label: 'Pending Approval' },
        { value: 'active', label: 'Active' },
        { value: 'paid_off', label: 'Paid Off' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'defaulted', label: 'Defaulted' },
      ]
    };
  },
  watch: {
    loan(newLoan) {
      if (newLoan) {
        this.formData.status = newLoan.status;
        this.formData.notes = '';
      }
    }
  },
  methods: {
    show() {
      this.$refs.statusModal.show();
    },
    close() {
      this.$refs.statusModal.close();
    },
    async saveStatus() {
      if (!this.formData.status) {
        alert('Please select a status.');
        return;
      }
      this.loading = true;
      try {
        await updateLoanStatus(this.loan.id, this.formData);
        this.$emit('status-updated');
        this.close();
      } catch (error) {
        console.error("Failed to update status:", error);
        alert('Could not update the status. Please try again.');
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* You can add extra specific styling here if needed, but Bootstrap's grid should handle most of it. */
.form-select, .form-control {
  font-size: 0.9rem; /* Slightly smaller font for a compact look */
}
/* Wrapper for positioning the custom arrow */
.custom-select-wrapper {
  position: relative;
  width: 100%; /* Adjust width as needed */
}

/* Custom arrow using a pseudo-element */
.custom-select-wrapper::after {
  content: '▼'; /* You can also use an SVG icon here */
  font-size: 0.8rem;
  color: #555;
  position: absolute;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none; /* Ensures clicks go to the select element */
}

/* Your form-select class, now with enhanced styling */
.form-select {
  /* Remove default browser appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Custom styling for a modern look */
  display: block;
  width: 100%;
  cursor: pointer;
  padding: 0.75rem 2.5rem 0.75rem 1rem; /* Right padding to avoid text overlapping the arrow */
  font-size: 1rem;
  line-height: 1.5;
  color: #333;
  background-color: #fff;
  border: 1px solid #ced4da;
  border-radius: 0.375rem; /* A modern, slightly rounded corner */
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Style for when the select box is focused (clicked or tabbed to) */
.form-select:focus {
  border-color: #86b7fe;
  /* outline: 0; */
  
}

/* IE-specific hack to hide the default arrow */
.form-select::-ms-expand {
  display: none;
}

</style>
