<template>
  <div class="loan-schedule-container table-responsive">
    <!-- Loading State -->
    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading Schedule...</p>
    </div>
    <!-- No Installments: Show Button -->
    <div v-else-if="!installments.length" class="text-center p-5">
      <p class="text-muted mb-4">No repayment schedule has been generated for this loan yet.</p>
      <button class="btn btn-dark px-4 py-2" :disabled="generating" @click="handleGenerateTenure" style="font-size: 1.08em;" v-if="is_allowed('loans','update')">
        <span v-if="!generating">Generate Tenure <i class="material-icons align-middle me-2" style="vertical-align:middle;">playlist_add</i></span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2"></span>
          Generating...
        </span>
      </button>
      <div v-if="apiError" class="text-danger mt-3">{{ apiError }}</div>
    </div>
    <!-- Table and Header -->
    <div v-else>
      <div class="mt-4">
        <div class="card-header pb-0 p-3">
          <div class="row">
            <div class="col-md-2 d-flex align-items-center">
              <span class="badge badge-sm" :class="loan_obj.status === 'active' || loan_obj.status === 'paid_off' ? 'bg-gradient-success' : 'bg-gradient-danger'">
                {{ loan_status[loan_obj.status] }}
              </span>
            </div>
            <div class="col-md-10 text-end d-flex justify-content-end gap-2" v-if="loan_obj.status == 'active'" >
              <!-- Early Closure Button -->
              <material-button color="danger" variant="gradient" @click="openEarlyClosureModal" v-if="is_allowed('loans','update')">
                <i class="fas fa-bolt me-2"></i>
                Early Closure
              </material-button>
              <!-- Download Button -->
              <material-button color="info" variant="gradient" @click="downloadSchedule">
                <i class="fas fa-download me-2"></i>
                Download
              </material-button>
              <material-button color="dark" variant="gradient" @click="openRepayModal" v-if="is_allowed('loans','update')">
                <i class="fas fa-dollar-sign me-2"></i>
                Add Payment
              </material-button>
              <material-button color="dark" variant="gradient" @click="openAdjustmentModal" v-if="is_allowed('loans','update')">
                <i class="fas fa-money-bill-wave me-2"></i>
                Add Adjustment
              </material-button>
            </div>
          </div>
        </div>
        <div class="card-body p-3">
          <div class="row">
            <div class="mb-md-0 mb-4">
              <div class="ccard card-body border card-plain border-radius-lg d-flex align-items-center flex-row w-100">
                <div class="d-flex flex-column">
                  <table>
                    <tr>
                      <td>Loan ID</td>
                      <td>:</td>
                      <td><span class="amount-figure text-primary">{{ loan_obj.loan_identifier }}</span></td>
                    </tr>
                     <tr>
                      <td>Interest</td>
                      <td>:</td>
                      <td><span class="amount-figure text-primary">{{ loan_obj.interest_rate }}</span></td>
                    </tr>
                    <tr>
                      <td>Interest Type</td>
                      <td>:</td>
                      <td>
                      <span class="amount-figure text-primary">
                        {{ loan_obj.interest_type.replace('_', ' ') }}
                      </span>
                    </td>
                    </tr>
                    <tr>
                      <td>Principal</td>
                      <td>:</td>
                      <td><span class="amount-figure text-primary">₹{{ loan_obj.principal_amount }}</span></td>
                    </tr>
                    <tr>
                      <td>Outstanding</td>
                      <td>:</td>
                      <td>
                        <span class="amount-figure" :class="totalOutstanding > 0 ? 'text-danger' : 'text-success'">
                          ₹{{ totalOutstanding.toFixed(2) }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="totalAdjustmentsAmount !== 0">
                      <td>Total Adjustments</td>
                      <td>:</td>
                      <td>
                        <span class="amount-figure text-info">
                          ₹{{ totalAdjustmentsAmount.toFixed(2) }}
                        </span>
                        <a href="#" @click.prevent="openAdjustmentsListModal" class="ms-3 text-sm font-weight-bold">
                          Show Details
                        </a>
                      </td>
                    </tr>
                  </table>
                </div>
                <div class="ms-auto fw-bold text-info">Repay Tenure : {{ loan_obj.loan_installments_count }} EMIs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table align-items-center mb-0">
        <thead>
          <tr>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">#</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Due Date</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Principal</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Interest Component</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Fees</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Total Due</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Outstanding</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Amount Paid</th>
            <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="installment in installments" :key="installment.id" :class="getRowClass(installment)">
            <td>{{ installment.installment_number }}</td>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-xs">{{ formatDate(installment.due_date) }}</h6>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-xs">&#8377;{{ installment.principal_component }}</h6>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-xs">{{ installment.interest_component }}</h6>
                </div>
              </div>
            </td>
            <td>
              <div class="d-flex px-2 py-1">
                <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-xs">{{ installment.fees_due }}</h6>
                </div>
              </div>
            </td>
            <td>
              <div class="text-xs font-weight-bold mb-0">
                &#8377;{{ (parseFloat(installment.amount_due) + parseFloat(installment.fees_due)).toFixed(2) }}
              </div>
              <div v-if="isPaid(installment)" class="text-xs small fst-italic">
                Paid on: {{ formatDate(installment.paid_at) }}
              </div>
            </td>
            <td class="text-xs font-weight-bold mb-0">
              <div class="text-xs font-weight-bold mb-0">
                &#8377;{{ calculateOutstanding(installment) }}
              </div>
            </td>
            <td>
              <div class="text-xs font-weight-bold mb-0">&#8377;{{ installment.amount_paid }}</div>
              <div v-if="installment.status == 'paid' || installment.status == 'partially_paid'" class="text-xs fst-italic">
                Paid on: {{ formatDate(installment.paid_at) }}
              </div>
            </td>
            <td>
              <span v-if="isPaid(installment)" title="Paid" class="text-secondary text-success">
                <span class="badge badge-sm bg-gradient-success">paid</span>
              </span>
              <span v-else title="Pending" class="text-xs">
                <span class="badge badge-sm" :class="[installment.status == 'pending' || installment.status == 'overdue' ? 'bg-gradient-danger' : 'bg-gradient-warning']">{{ installment_status[installment.status] }}</span>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Early Closure Modal -->
    <BaseModal ref="earlyClosureModal" modal-id="earlyClosureModalId" size="md">
      <template #header>
        <h5 class="modal-title">Early Loan Closure</h5>
        <button type="button" class="btn-close" @click="closeEarlyClosureModal" aria-label="Close"></button>
      </template>
      <div class="p-3">
        <!-- <div class="mb-3">
          <div>
            <strong>Outstanding Balance:</strong>
            <span class="amount-figure text-danger">₹{{ totalOutstanding.toFixed(2) }}</span>
          </div>
          <div>
            <strong>Early Closure Fee (2%):</strong>
            <span class="amount-figure text-info">₹{{ earlyClosureFee.toFixed(2) }}</span>
          </div>
          <div class="mt-2">
            <strong>Payoff Total:</strong>
            <span class="amount-figure text-primary fs-5">₹{{ earlyClosureTotal.toFixed(2) }}</span>
          </div>
        </div> -->

        <EarlyClosureForm 
            ref="earlyClosureForm" 
            :principal-outstanding="principalOutstanding"
            :total-outstanding="totalOutstanding"
            :closure-fee="earlyClosureFee"
            :payoff-total="earlyClosureTotal"
            @early_closure_submit="handleEarlyClosureSubmit" 
        />
        <p>Are you sure you want to close this loan early? This payment will fully settle the outstanding loan.</p>
      </div>
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeEarlyClosureModal">Cancel</button>
        <button type="button" class="btn btn-danger"  @click="earlyClosurePoker" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          {{ loading ? 'Processing...' : 'Settle & Close Loan' }}
        </button>
      </template>
    </BaseModal>

    <!-- Repay Modal -->
    <BaseModal ref="repayModal" modal-id="repaymentModal" size="md">
      <template #header>
        <h5 class="modal-title">Make Loan Repayment</h5>
        <button type="button" class="btn-close" @click="closeRepayModal" aria-label="Close"></button>
      </template>
      <LoanRepaymentPopup ref="repayForm" :max-amount="totalOutstanding" @payment_submit="handleRepayment" />
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeRepayModal">Cancel</button>
        <button type="button" class="btn btn-success" @click="repaymentPoker" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </template>
    </BaseModal>

    <!-- Adjustment Modal -->
    <BaseModal ref="adjustModal" modal-id="adjustmentModal" size="md">
      <template #header>
        <h5 class="modal-title">Make Loan Adjustments</h5>
        <button type="button" class="btn-close" @click="closeAdjustModal" aria-label="Close"></button>
      </template>
      <LoanAdjustmentForm :installments="installments" @adjustment_submit="handleAdjustmentSubmit" ref="adjustForm" />
      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeAdjustModal">Cancel</button>
        <button type="button" class="btn btn-success" @click="adjustmentPoker" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
          {{ loading ? 'Saving...' : 'Save' }}
        </button>
      </template>
    </BaseModal>

    <!-- Adjustment List Modal -->
    <BaseModal ref="adjListModal" modal-id="adjListModalid" size="md">
      <template #header>
        <h5 class="modal-title">Loan Adjustments</h5>
        <button type="button" class="btn-close" @click="closeAdjListModal" aria-label="Close"></button>
      </template>
      <LoanAdjustmentListPopup ref="adjListForm" :adjustments="loan_obj.all_adjustments" />
    </BaseModal>
  </div>
</template>

<script>
import BaseModal from '@/views/components/BaseModal.vue'
import LoanRepaymentPopup from './LoanRepaymentPopup.vue'
import EarlyClosureForm from './EarlyClosureForm.vue'
import MaterialButton from "@/components/MaterialButton.vue";
import showSwal from "@/mixins/showSwal.js";
import LoanAdjustmentForm from "./LoanAdjustmentForm.vue"
import LoanAdjustmentListPopup from './LoanAdjustmentListPopup.vue';
import { fetchLoanInstallments, generateLoanSchedule, submitRepayment, addLoanAdjustments, submitEarlyClosureMain } from '@/utils/loan_services';
import { is_allowed , getUserRole} from "@/utils/api_services"; 

export default {
  name: 'LoanSchedule',
  props: {
    loanId: { type: Number, default: null },
    loan_obj: { type: Object, default: () => ({}) }
  },
  components: {
    BaseModal,
    LoanRepaymentPopup,
    MaterialButton,
    LoanAdjustmentForm,
    LoanAdjustmentListPopup,
    EarlyClosureForm
  },
  data() {
    return {
      isSubmitting: false,
      installments: [],
      loan_status: {
        'active': 'Active',
        'pending_approval': 'Pending Approval',
        'paid_off': 'Paid Off',
        'overdue': 'Overdue',
        'cancelled': 'Cancelled',
        'defaulted': 'Defaulted',
        'pending_update_approval': 'Pending Update Approval From Admin'
      },
      installment_status: {
        'paid': 'Paid',
        'pending': 'Pending',
        'partially_paid': 'Partially Paid',
        'overdue': 'Overdue',
        'waived': 'Waived'
      },
      loading: false,
      generating: false,
      apiError: "",
    };
  },
  watch: {
    loanId: {
      handler(newId) {
        if (newId) this.fetchInstallments(newId);
        else this.installments = [];
      },
      immediate: true
    }
  },
  computed: {
    // 1. STANDARD OUTSTANDING (Includes Interest) - Used for Dashboard & Standard Repayment
    totalOutstanding() {
      return this.installments.reduce((total, installment) => {
        if (installment.status !== 'paid' && installment.status !== 'waived') {
          // Standard logic: Amount Due (Prin+Int) + Fees - Paid
          const totalDue = parseFloat(installment.amount_due || 0) + parseFloat(installment.fees_due || 0);
          const paid = parseFloat(installment.amount_paid || 0);
          total += Math.max(0, totalDue - paid);
        }
        return total;
      }, 0);
    },
    // 2. PRINCIPAL OUTSTANDING (Excludes Future Interest) - Used for Early Closure Only
    earlyClosureFee() {
      // Logic changed: Uses totalOutstanding (1700) instead of principal
      return this.totalOutstanding * 0.02;
    },

    earlyClosureTotal() {
      return this.totalOutstanding + this.earlyClosureFee;
    },
    totalAdjustmentsAmount() {
      if (this.loan_obj.all_adjustments && Array.isArray(this.loan_obj.all_adjustments)) {
        return this.loan_obj.all_adjustments.reduce((sum, adjustment) => {
          return sum + (parseFloat(adjustment.amount) || 0);
        }, 0);
      }
      return 0;
    },
  },
  methods: {
    is_allowed,
    downloadSchedule() {
      if (!this.installments.length) {
        alert("No schedule data to download.");
        return;
      }
      const headers = [
        'Installment #',
        'Due Date',
        'Principal',
        'Interest',
        'Fees',
        'Total Due',
        'Outstanding',
        'Amount Paid',
        'Status'
      ];
      const rows = this.installments.map(inst => [
        `"${inst.installment_number}"`,
        `"${this.formatDate(inst.due_date)}"`,
        `"${inst.principal_component}"`,
        `"${inst.interest_component}"`,
        `"${inst.fees_due}"`,
        `"${(parseFloat(inst.amount_due) + parseFloat(inst.fees_due)).toFixed(2)}"`,
        `"${this.calculateOutstanding(inst)}"`,
        `"${inst.amount_paid}"`,
        `"${this.installment_status[inst.status]}"`
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      // const timestamp = new Date().toISOString().slice(0, 19).replace('T', '_').replace(/:/g, '-');
      const suffix = new Date().getTime();
      const filename = `SPTM-LRS${suffix}.csv`;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    calculateOutstanding(installment) {
      if (installment.status === 'paid') return '0.00';
      const totalDue = parseFloat(installment.amount_due || 0) + parseFloat(installment.fees_due || 0);
      const paid = parseFloat(installment.amount_paid || 0);
      return Math.max(0, totalDue - paid).toFixed(2);
    },
    async handleAdjustmentSubmit(adjustmentData) {
      if (this.isSubmitting) return;
      this.isSubmitting = true;
      this.loading = true;
      try {
        await addLoanAdjustments(this.loanId, adjustmentData);
        showSwal.methods.showSwal({
          type: "success",
          message: "Loan adjustments added successfully!",
          width: 500
        });
        this.closeAdjustModal();
        
        await this.fetchInstallments(this.loanId);
      } catch (error) {
        console.error(error);
      } finally {
        this.isSubmitting = false;
        this.loading = false;
      }
    },
    repaymentPoker() { this.$refs.repayForm.submit(); },
    earlyClosurePoker(){this.$refs.earlyClosureForm.submit();},
    adjustmentPoker() { this.$refs.adjustForm.submit(); },
    async handleEarlyClosureSubmit(payment_obj) {
      this.loading = true;
      try {
        await submitEarlyClosureMain(this.loanId, payment_obj);
        const role = getUserRole();
        let message = "Loan closure successful!";
        if(role != 'Admin') {
          message = "Loan closure Submit For Approval!";
        }
        this.loading = false;
        showSwal.methods.showSwal({
          type: "success",
          message: message,
          width: 500
        });
        this.closeEarlyClosureModal();
        await this.fetchInstallments(this.loanId);
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },

    async handleRepayment(payment_obj) {
      this.loading = true;
      try {
        await submitRepayment(this.loanId, payment_obj);
        this.loading = false;
        showSwal.methods.showSwal({
          type: "success",
          message: "Loan payment successful!",
          width: 500
        });
        this.closeRepayModal();
        await this.fetchInstallments(this.loanId);
      } catch (error) {
        this.loading = false;
        console.error(error);
      }
    },
    openRepayModal() { this.$refs.repayModal.show(); },
    openAdjustmentsListModal() { this.$refs.adjListModal.show(); },
    openAdjustmentModal() { this.$refs.adjustModal.show(); },
    closeRepayModal() { this.$refs.repayModal.close(); },
    closeAdjListModal() { this.$refs.adjListModal.close(); },
    closeAdjustModal() { this.$refs.adjustModal.close(); },
    async fetchInstallments(id) {
      this.loading = true;
      this.apiError = "";
      try {
        const response = await fetchLoanInstallments(id);
        this.installments = response.data.data;
      } catch (error) {
        console.error("Failed to fetch loan installments:", error);
        this.installments = [];
      } finally {
        this.loading = false;
      }
    },
    async handleGenerateTenure() {
      if (!this.loanId) return;
      this.generating = true;
      this.apiError = "";
      try {
        await generateLoanSchedule(this.loanId);
        this.$emit('tenure-generated');
        await this.fetchInstallments(this.loanId);
      } catch (err) {
        this.apiError = err?.response?.data?.message || 'Failed to generate schedule. Please try again.';
      } finally {
        this.generating = false;
      }
    },
    isPaid(installment) { return installment.status === 'paid'; },
    getRowClass(installment) {
      if (this.isPaid(installment) && installment.paid_at) {
        const paidDate = new Date(installment.paid_at);
        const dueDate = new Date(installment.due_date);
        paidDate.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        if (paidDate > dueDate) return 'table-warning';
      }
      return '';
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
    openEarlyClosureModal() { this.$refs.earlyClosureModal.show(); },
    closeEarlyClosureModal() { this.$refs.earlyClosureModal.close(); },
    async submitEarlyClosure(loanId, payment_obj) {
      this.loading = true;
      try {
        await submitEarlyClosureMain(this.loanId, payment_obj);
        showSwal.methods.showSwal({
          type: "success",
          message: "Loan closed successfully!",
          width: 500
        });
        this.closeEarlyClosureModal();
        this.$emit('tenure-generated');
        await this.fetchInstallments(this.loanId);
      } catch (error) {
        showSwal.methods.showSwal({
          type: "error",
          message: (error?.response?.data?.message) || "Failed early closure. Please try again.",
          width: 500
        });
      } finally {
        this.loading = false;
      }
    },
  }
};
</script>

<style scoped>
.label-text {
  font-size: 1.04em;
  font-weight: 500;
  color: #5a5a7a;
  margin-right: 0.8em;
}
h5 {
  color: white !important;
}
.amount-figure {
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.02em;
  margin-left: 0.2em;
}
.status-icon {
  font-size: 1.5rem;
  vertical-align: middle;
}
.text-muted.mb-4 {
  margin-bottom: 1.7rem !important;
}
</style>
