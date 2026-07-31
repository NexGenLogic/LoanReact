<template>
  <div class="modal fade" ref="investorStatusModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Change Investor Status</h5>
          <button type="button" class="btn-close" @click="hide" aria-label="Close"></button>
        </div>
        <div class="modal-body" v-if="investor">
          <p>
            Investor: <strong>{{ investor.name }}</strong>
            <br>
            <span class="text-sm">Current Status: 
              <span :class="`badge bg-gradient-${statusBadges[investor.status]}`">{{ statusLabels[investor.status] || investor.status }}</span>
            </span>
          </p>
          
          <form @submit.prevent="submitStatusChange" class="mt-4">
            <!-- Row 1: Status Dropdown -->
            <div class="row align-items-center mb-3">
              <div class="col-4">
                <label for="investor-status" class="col-form-label fw-bold">Status:</label>
              </div>
              <div class="col-8">
                <select id="investor-status" class="form-select" v-model="newStatus" required>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="blacklisted">Blacklisted</option>
                </select>
              </div>
            </div>

            <!-- Row 2: Notes Textarea -->
            <div class="row align-items-start">
              <div class="col-4">
                <label for="status-notes" class="col-form-label fw-bold">Note:</label>
              </div>
              <div class="col-8">
                <textarea id="status-notes" class="form-control" rows="3" v-model="notes" placeholder="Optional..."></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hide">Cancel</button>
          <button type="button" class="btn btn-primary" @click="submitStatusChange" :disabled="loading">
             <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
             {{ loading ? 'Saving...' : 'Update Status' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';
import { updateInvestorStatus } from "@/utils/investor_services"; 
import showSwal from "@/mixins/showSwal.js";

export default {
  name: 'ChangeInvestorStatusModal',
  props: {
    investor: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      modalInstance: null,
      loading: false,
      newStatus: '', // Initialize as empty
      notes: '',
      statusLabels: {
        pending_approval: 'Pending Approval',
        active: 'Active',
        inactive: 'Inactive',
        blacklisted: 'Blacklisted'
      },
      statusBadges: {
        pending_approval: 'warning',
        active: 'success',
        inactive: 'secondary',
        blacklisted: 'danger'
      },
    };
  },
  mounted() {
    this.modalInstance = new Modal(this.$refs.investorStatusModal);
  },
  methods: {
    show() {
      // *** THE FIX IS HERE ***
      // This ensures the form is reset with the current investor's data
      // every single time the modal is opened.
      if (this.investor) {
        this.newStatus = this.investor.status;
        this.notes = ''; // Reset notes field
      }
      this.modalInstance.show();
    },
    hide() {
      this.modalInstance.hide();
    },
    async submitStatusChange() {
      if (!this.investor) return;
      this.loading = true;

      try {
        const formData = new FormData();
        formData.append('status', this.newStatus); 
        formData.append('notes', this.notes);

        await updateInvestorStatus(this.investor.id, formData);
        
        this.$emit('status-updated');
        this.hide();
      } catch (error) {
        console.error("Failed to update investor status:", error);
        showSwal.methods.showSwal({
            type: "error",
            message: "Failed to update status. Please try again.",
            width: 500
        });
      } finally {
          this.loading = false;
      }
    },
  },
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
