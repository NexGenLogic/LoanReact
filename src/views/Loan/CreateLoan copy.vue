<template> 
  <div class="multisteps-form__panel border-radius-xl card" style="max-width: 1000px; margin:2rem auto;">
    <div class="multisteps-form__content">
      <!-- TABS -->
      <div class="tabs mb-3 bg-gradient-success">
        <button @click="activeTab = 'details'" :class="{ 'active-tab': activeTab === 'details' }">Loan Details</button>
        <button @click="activeTab = 'documents'" :class="{ 'active-tab': activeTab === 'documents' }" :disabled="!isEditing">Loan Documents</button>
        <button @click="activeTab = 'tenure'" :class="{ 'active-tab': activeTab === 'tenure' }" :disabled="!isEditing">Loan Tenure</button>
        <button @click="activeTab = 'payment_history'" :class="{ 'active-tab': activeTab === 'payment_history' }" :disabled="!isEditing">Payment History</button>
      </div>

      <!-- TAB CONTENT -->
      <div v-if="activeTab === 'details'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <form @submit.prevent="submitLoanDetails">
          <div class="grid-form">
            <!-- Customer -->
            <div>
              <label class="form-label" for="customer">Customer</label>
              <SearchableDropdown v-model="loan.customer_id" :options="customers" placeholder="Customers..." :disabled="installmentsExist"  />
              <div v-html="customerErr"></div>
            </div>

            <!-- Principal Amount -->
            <div>
              <label class="form-label" for="principal_amount">Principal Amount</label>
              <input type="number" id="principal_amount" class="form-control" :disabled="installmentsExist"  v-model.number="loan.principal_amount" required />
            </div>

            <!-- Interest Rate -->
            <div>
              <label class="form-label" for="interest_rate">Interest Rate (%)</label>
              <input type="number" :disabled="installmentsExist" id="interest_rate" class="form-control" v-model.number="loan.interest_rate" step="0.01" required />
            </div>

            <!-- Interest Type -->
            <div>
              <label class="form-label" for="interest_type">Interest Type</label>
              <select id="interest_type" :disabled="installmentsExist" v-model="loan.interest_type" class="form-select" required>
                <option value="flat">Flat</option>
                <option value="reducing_balance">Reducing Balance</option>
                <option value="bullet">Local Finance Loan</option>
              </select>
            </div>

            <!-- Loan Term -->
            <div>
              <label class="form-label" for="loan_term">Loan Term</label>
              <input type="number" :disabled="installmentsExist" id="loan_term" class="form-control" v-model.number="loan.loan_term" required />
            </div>

            <!-- Term Period -->
            <div>
              <label class="form-label" for="term_period">Term Period</label>
              <select id="term_period" :disabled="installmentsExist" v-model="loan.term_period" class="form-select" required>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

            <!-- Repayment Frequency -->
            <div>
              <label class="form-label" for="repayment_frequency">Repayment Frequency</label>
              <select id="repayment_frequency" :disabled="installmentsExist" v-model="loan.repayment_frequency" class="form-select" required>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <!-- Start Date -->
            <div>
              <label class="form-label" for="start_date">Start Date</label>
              <input type="date" :disabled="installmentsExist" id="start_date" class="form-control" v-model="formattedStartDate" required />
            </div>
          </div>

          <!-- Purpose (full width) -->
          <div>
            <label class="form-label" for="purpose">Purpose</label>
            <textarea id="purpose" class="form-control" style="min-height:74px;" v-model="loan.purpose"></textarea>
          </div>
          <!-- Notes (full width) -->
          <div>
            <label class="form-label" for="notes">Notes</label>
            <textarea id="notes" class="form-control" style="min-height:74px;" v-model="loan.notes"></textarea>
          </div>

          <div class="text-danger text-sm mb-3" v-html="error_html"></div>
          <div class="button-row d-flex mt-3 justify-content-end">
            <material-button type="submit" color="dark" variant="gradient" class="px-4 py-2">
              <span v-if="!loading">{{ isEditing ? 'Update' : 'Create' }} Loan</span>
              <PulseLoader v-if="loading" text="Saving" />
            </material-button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === 'documents'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <LoanDocumentUploader :loanId="loan_id" />
      </div>
      <div v-if="activeTab === 'tenure'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <LoanSchedule :loanId="loan_id" :loan_obj="loan" @tenure-generated="refreshLoanData"  />
      </div>
      <div v-if="activeTab === 'payment_history'" class="tab-content bg-white px-3 rounded-bottom">
        <LoanPaymentHistory :loanId="loan_id" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchableDropdown from '@/views/components/SearchableDropdown.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import { fetchCustomers } from "@/utils/customer_services";
import {createLoan, updateLoan, fetchLoanById} from "@/utils/loan_services";
import PulseLoader from "../PulseLoader.vue";
import showSwal from "@/mixins/showSwal.js";
import LoanDocumentUploader from './LoanDocumentUploader.vue';
import LoanSchedule from './LoanSchedule.vue';
import LoanPaymentHistory from "./LoanPaymentHistory.vue";

export default {
  name: 'LoanForm',
  components: {
    SearchableDropdown,
    MaterialButton,
    PulseLoader,
    LoanDocumentUploader,
    LoanSchedule,
    LoanPaymentHistory
  },
  props: {
    loanId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      activeTab: 'details',
      installmentsExist: false,
      isEditing: false,
      customers: [],
      customerErr: "",
      loading: false,
      loan_id: null,
      error_html: "",
      loan: {
        customer_id: null,
        principal_amount: null,
        interest_rate: null,
        interest_type: 'flat',
        loan_term: null,
        term_period: 'months',
        repayment_frequency: 'monthly',
        start_date: null,
        purpose: '',
        notes: '',
        status : '',
        outstanding : '',
        loan_installments_count : '',
        general_adjustments : [],
        all_adjustments:[]
      }
    }
  },
  watch: {
    loanId: {
      immediate: true,
      handler(newVal) {
        this.initializeComponent(newVal);
      }
    }
  },
  computed: {
    formattedStartDate: {
      get() {
        if (!this.loan.start_date) return null;
        return this.loan.start_date.split('T')[0];
      },
      set(value) {
        this.loan.start_date = value;
      }
    }
  },
  methods: {
// In LoanForm.vue -> methods

async refreshLoanData() {
  // Ensure we have a loan ID before attempting to refresh
  if (!this.loan_id) {
    console.warn("refreshLoanData called without a valid loan_id.");
    return;
  }

  try {
    // Use the existing API service function to get the latest loan data
    const response = await fetchLoanById(this.loan_id);
    const loanData = response.data.data;

    // Update the local 'loan' object with the fresh data from the server.
    // This will automatically update the :loan_obj prop in the child component.
    this.loan = {
      customer_id: loanData.customer_id,
      principal_amount: loanData.principal_amount,
      interest_rate: loanData.interest_rate,
      interest_type: loanData.interest_type,
      loan_term: loanData.loan_term,
      term_period: loanData.term_period,
      repayment_frequency: loanData.repayment_frequency,
      start_date: loanData.start_date,
      purpose: loanData.purpose,
      notes: loanData.notes,
      status: loanData.status,
      outstanding: loanData.outstanding,
      loan_installments_count: loanData.loan_installments_count,
      general_adjustments : loanData.general_adjustments,
      all_adjustments : loanData.all_adjustments
    };

    // Also, update any other state that depends on the loan data
    this.installmentsExist = !!(loanData.loan_installments_count && loanData.loan_installments_count > 0);

  } catch (error) {
    console.error("Failed to refresh loan data:", error);
    // Optionally, show an error to the user
    showSwal.methods.showSwal({
      type: "error",
      message: "Could not refresh loan details. Please check your connection.",
    });
  }
},

    async initializeComponent(loanId) {
      this.loading = true;
      this.resetForm();
      try {
        const promises = [fetchCustomers()];
        if (loanId) {
          promises.push(fetchLoanById(loanId));
          this.isEditing = true;
          this.loan_id = loanId;
        }
        const [customerResponse, loanResponse] = await Promise.all(promises);

        // this.customers = customerResponse.data.data.customers.data;
        this.customers = customerResponse.data.data.customers.data.filter(customer => customer.active == 1);
        if (loanResponse) {
          const loanData = loanResponse.data.data;
          this.loan = {
            customer_id: loanData.customer_id,
            principal_amount: loanData.principal_amount,
            interest_rate: loanData.interest_rate,
            interest_type: loanData.interest_type,
            loan_term: loanData.loan_term,
            term_period: loanData.term_period,
            repayment_frequency: loanData.repayment_frequency,
            start_date: loanData.start_date,
            purpose: loanData.purpose,
            notes: loanData.notes,
            status : loanData.status,
            outstanding : loanData.outstanding,
            loan_installments_count : loanData.loan_installments_count,
            general_adjustments : loanData.general_adjustments,
            all_adjustments : loanData.all_adjustments
          }

          this.installmentsExist = !!(loanData.loan_installments_count && loanData.loan_installments_count > 0);
          // this.installmentsExist =loanData.loan_installments;
        }else {
          this.installmentsExist = false;
        }
      } catch (error) {
        console.error("Failed to initialize component:", error);
        this.error_html = "<div style='color:red'>Failed to load required data.</div>";
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.loan = {
        customer_id: null,
        principal_amount: null,
        interest_rate: null,
        interest_type: 'flat',
        loan_term: null,
        term_period: 'months',
        repayment_frequency: 'monthly',
        start_date: null,
        purpose: '',
        notes: '',
        status : "",
        outstanding : "",
        loan_installments_count : "",
        general_adjustments: [],
        all_adjustments : []
      };
      this.loan_id = null;
      this.customerErr = "";
      this.error_html = "";
    },
    async submitLoanDetails() {
      if(!this.loan.customer_id) {
        this.customerErr = "<div style='color:red'> Please select customer </div>"
        return false;
      } else {
        this.customerErr = "";
      }
      try {
        this.loading = true;
        if (!this.isEditing) {
          const response = await createLoan(this.loan);
          this.loan_id = response.data.data.id;
          this.isEditing = true;
          this.loading = false;
          this.error_html = "";
          showSwal.methods.showSwal({
            type: "success",
            message: "Loan created successfully!",
            width: 500
          });
        } else {
          await updateLoan(this.loan_id, this.loan);
          showSwal.methods.showSwal({
            type: "success",
            message: "Loan updated successfully!",
            width: 500
          });
        }
        this.error_html = ""; 
      } catch(error) {
        let errorMessage = "Failed to create loan. Please try again.";
        if(error.html) {
          errorMessage = error.html
        }
        this.error_html = errorMessage;
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
/* Root card and panel */
.card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 24px 2px #28294a18;
  border: none;
}
.multisteps-form__panel {
  /* for max-width and centering */
}

/* TAB STYLES */
.tabs {
  display: flex;
  gap: 2px;
  /* background: #f0f0f7; */
  padding: 3px 0 0 0;
  border-radius: 0.6rem 0.6rem 0 0;
}
.tabs button {
  padding: 10px 28px;
  border: none;
  background-color: transparent;
  color: #fff;
  font-weight: 600;
  border-radius: 0.7rem 0.7rem 0 0;
  font-size: 1em;
  transition: background 0.18s, color 0.18s;
}
.tabs button.active-tab {
  background-color: #fff;
  color: #144665;
  /*border-bottom: 2.5px solid #1976d2;*/
}
.tabs button:disabled {
  background-color: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}

/* Tab content like employee form */
.tab-content {
  border: 1px solid #eee;
  border-radius: 0 0 20px 20px;
  margin-top: -3px;
  box-shadow: 0 1px 4px #e4e7ed2b;
  /* Remove top border if needed */
}

/* FORM GRID (copied from Employee style) */
.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 34px;
  margin-bottom: 16px;
}
@media (max-width: 900px) {
  .grid-form { grid-template-columns: 1fr; gap: 22px 0; }
}

/* Inputs & Selects */
.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #344767;
  margin-bottom: 0.3rem;
  display: block;
}
.form-select,
input[type="number"],
input[type="date"],
textarea {
  display: block;
  width: 100%;
  padding: 0.54rem 1rem;
  font-size: 1.03rem;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  border: 1px solid #d2d6da;
  border-radius: 0.5rem;
  transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
  margin-bottom: 2px;
}
.form-select:focus,
input[type="number"]:focus,
input[type="date"]:focus,
textarea:focus {
  border-color: #86b7fe;
  /* outline: 0; */
  box-shadow: 0 0 0 0.16rem rgb(13 110 253 / 15%);
}

/* Button row matches employee */
.button-row .material-button {
  font-size: 1.12em;
  min-width: 120px;
}

.text-danger {
  color: #e53935;
}
.text-sm {
  font-size: 0.94em;
}

</style>
