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

        <div v-if="loan.status === 'active' && isNonAdmin" class="alert alert-danger text-white text-center">
          <strong>Active loans cannot be modified by staff. Please contact an admin.</strong>
        </div>
        <div v-if="loan.status === 'pending_update_approval'" class="alert alert-warning text-white text-center">
          <strong>This loan has pending updates awaiting admin approval. Editing is currently disabled.</strong>
        </div>
        <form @submit.prevent="submitLoanDetails">
          <div class="grid-form">
            <!-- Customer -->
            <div>
              <label class="form-label" for="customer">Customer</label>
              <SearchableDropdown v-model="loan.customer_id" :options="customers" placeholder="Customers..." :disabled="isFormDisabled" />
              <div v-html="customerErr"></div>
            </div>

            <!-- Principal Amount -->
            <div>
              <label class="form-label" for="principal_amount">Principal Amount</label>
              <input type="number" id="principal_amount" class="form-control" :disabled="isFormDisabled" v-model.number="loan.principal_amount" required />
            </div>

            <!-- Interest Rate -->
            <div>
              <label class="form-label" for="interest_rate">Interest Rate (%)</label>
              <input type="number" :disabled="isFormDisabled" id="interest_rate" class="form-control" v-model.number="loan.interest_rate" step="0.01" required />
            </div>

            <!-- Interest Type -->
            <div>
              <label class="form-label" for="interest_type">Interest Type</label>
              <select id="interest_type" :disabled="isFormDisabled" v-model="loan.interest_type" class="form-select" required>
                <option value="flat">Flat</option>
                <option value="reducing_balance">Reducing Balance</option>
                <option value="local_finance">Local Finance Loan</option>
              </select>
            </div>

            <!-- Loan Term -->
            <div>
              <label class="form-label" for="loan_term">Loan Term</label>
              <input type="number" :disabled="isFormDisabled" id="loan_term" class="form-control" v-model.number="loan.loan_term" required />
            </div>

            <!-- Term Period -->
            <div>
              <label class="form-label" for="term_period">Term Period</label>
              <select id="term_period" :disabled="isFormDisabled" v-model="loan.term_period" class="form-select" required>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

            <!-- Repayment Frequency -->
            <div>
              <label class="form-label" for="repayment_frequency">Repayment Frequency</label>
              <select id="repayment_frequency" :disabled="isFormDisabled" v-model="loan.repayment_frequency" class="form-select" required>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <!-- Start Date -->
            <div>
              <label class="form-label" for="start_date">Start Date</label>
              <input type="date" :disabled="isFormDisabled" id="start_date" class="form-control" v-model="formattedStartDate" required />
            </div>
          </div>

          <!-- Purpose -->
          <div>
            <label class="form-label" for="purpose">Purpose</label>
            <textarea id="purpose" class="form-control" :disabled="isFormDisabled" style="min-height:74px;" v-model="loan.purpose"></textarea>
          </div>
          <!-- Notes -->
          <div>
            <label class="form-label" for="notes">Notes</label>
            <textarea id="notes" class="form-control" :disabled="isFormDisabled" style="min-height:74px;" v-model="loan.notes"></textarea>
          </div>

         <div class="text-danger text-sm mb-3" v-html="error_msg"></div>
          <div class="button-row d-flex mt-3 justify-content-end" v-if="is_allowed('loans','update')">
            <material-button type="submit" color="dark" variant="gradient" class="px-4 py-2" :disabled="isFormDisabled || loading">
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
      <div v-if="activeTab === 'payment_history'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <LoanPaymentHistory :loanId="loan_id" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchableDropdown from '@/views/components/SearchableDropdown.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import { fetchCustomers } from "@/utils/customer_services";
import { createLoan, updateLoan, fetchLoanById, requestLoanUpdate } from "@/utils/loan_services";
import PulseLoader from "../PulseLoader.vue";
import showSwal from "@/mixins/showSwal.js";
import LoanDocumentUploader from './LoanDocumentUploader.vue';
import LoanSchedule from './LoanSchedule.vue';
import LoanPaymentHistory from "./LoanPaymentHistory.vue";
import { is_allowed } from "@/utils/api_services"; 

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
      isEditing: false,
      customers: [],
      customerErr: "",
      loading: false,
      loan_id: null,
      error_html: "",
      originalLoan: null, // Stores a copy of the loan data on load
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
        status: '',
        outstanding: '',
        loan_installments_count: '',
        general_adjustments: [],
        all_adjustments: []
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
    // *** THE FIX IS HERE ***
    // This computed property now safely reads user data directly from localStorage,
    // matching the pattern in your api_services.js file.
    currentUser() {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          return JSON.parse(userString);
        } catch (e) {
          console.error("Error parsing user data from localStorage", e);
          return null;
        }
      }
      return null;
    },
  isNonAdmin() {
        // Assuming role_id 1 is Admin. If the ID is NOT 1, they are staff/other.
        return this.currentUser && this.currentUser.role_id !== 1;
      },
    isFormDisabled() {
      // Condition A: Loan is waiting for approval (Existing logic)
      if (this.loan.status === 'pending_update_approval') return true;

      // Condition B: Loan is ACTIVE and user is NOT Admin (New Logic)
      if (this.loan.status === 'active' && this.isNonAdmin) return true;

      return false;
    },

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
    is_allowed,
    async refreshLoanData() {
      if (!this.loan_id) {
        return;
      }
      try {
        const response = await fetchLoanById(this.loan_id);
        const loanData = response.data.data;
        this.loan = { ...this.loan, ...loanData };
        this.originalLoan = JSON.parse(JSON.stringify(this.loan)); // Also update the original copy
      } catch (error) {
        console.error("Failed to refresh loan data:", error);
        showSwal.methods.showSwal({
          type: "error",
          message: "Could not refresh loan details.",
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
        this.customers = customerResponse.data.data.customers.data.filter(customer => customer.active == 1);
        if (loanResponse) {
          const loanData = loanResponse.data.data;
          this.loan = { ...this.loan, ...loanData };
          // Store a deep copy of the original loan data for later comparison
          this.originalLoan = JSON.parse(JSON.stringify(this.loan));
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
        status: "",
        outstanding: "",
        loan_installments_count: "",
        general_adjustments: [],
        all_adjustments: []
      };
      this.loan_id = null;
      this.customerErr = "";
      this.error_html = "";
      this.originalLoan = null;
    },

    getChangedFields(newData, originalData) {
        const changes = {};
        const editableFields = [
            'principal_amount', 'interest_rate', 'interest_type', 
            'loan_term', 'term_period', 'repayment_frequency', 
            'start_date', 'purpose', 'notes'
        ];

        for (const key of editableFields) {
            const oldValue = String(originalData[key] ?? '').trim();
            const newValue = String(newData[key] ?? '').trim();
            
            if (oldValue !== newValue) {
                changes[key] = newData[key];
            }
        }
        return changes;
    },

  async submitLoanDetails() {
    this.error_msg = "";
    if (!this.loan.customer_id) {
      this.customerErr = "<div style='color:red'> Please select customer </div>";
      return;
    } else {
      this.customerErr = "";
    }

    this.loading = true;
    this.error_html = "";

    try {
      if (!this.isEditing) {
        // --- CREATE LOAN (No changes needed here) ---
        const response = await createLoan(this.loan);
        this.loan_id = response.data.data.id;
        this.isEditing = true;
        showSwal.methods.showSwal({
          type: "success",
          message: "Loan created successfully! It may require admin approval.",
        });
        this.initializeComponent(this.loan_id);
      } else {
        
        // --- UPDATE LOAN (LOGIC MODIFIED) ---
        const isStaff = this.currentUser && this.currentUser.role_id === 2;
        const isLoanActive = this.originalLoan && this.originalLoan.status === 'active';

        if (isStaff && isLoanActive) {
          // Staff editing an ACTIVE loan -> Submit for approval
          const changedData = this.getChangedFields(this.loan, this.originalLoan);
          if (Object.keys(changedData).length === 0) {
            showSwal.methods.showSwal({ type: "info", message: "No changes were detected." });
            this.loading = false; // Stop loading indicator
            return;
          }
          await requestLoanUpdate(this.loan_id, changedData);
          showSwal.methods.showSwal({
            type: "success",
            message: "Loan update has been submitted for admin approval.",
          });
          this.refreshLoanData();
        } else {
          // Admin editing, or loan is not yet active -> Update directly
          
          // *** THE FIX IS HERE ***
          // Instead of sending the whole `this.loan` object, we send a clean payload.
          const updatePayload = {
              customer_id: this.loan.customer_id,
              principal_amount: this.loan.principal_amount,
              interest_rate: this.loan.interest_rate,
              interest_type: this.loan.interest_type,
              loan_term: this.loan.loan_term,
              term_period: this.loan.term_period,
              repayment_frequency: this.loan.repayment_frequency,
              start_date: this.loan.start_date,
              purpose: this.loan.purpose,
              notes: this.loan.notes,
          };

          await updateLoan(this.loan_id, updatePayload);
          showSwal.methods.showSwal({
            type: "success",
            message: "Loan updated successfully!",
          });
          this.refreshLoanData();
        }
      }
    } catch(error) {
      console.log(error)
      let errorMessage = "An error occurred. Please try again.";
      // Improved error message handling
        if(error.html) {
            errorMessage = error.html
        }
        this.error_msg = errorMessage;
    } finally {
      this.loading = false;
    }
  }

  }
}
</script>

<style scoped>
/* All styles are the same */
.card {
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 4px 24px 2px #28294a18;
  border: none;
}
.tabs {
  display: flex;
  gap: 2px;
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
}
.tabs button:disabled {
  background-color: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
.tab-content {
  border: 1px solid #eee;
  border-radius: 0 0 20px 20px;
  margin-top: -3px;
  box-shadow: 0 1px 4px #e4e7ed2b;
}
.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px 34px;
  margin-bottom: 16px;
}
@media (max-width: 900px) {
  .grid-form { grid-template-columns: 1fr; gap: 22px 0; }
}
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
  box-shadow: 0 0 0 0.16rem rgb(13 110 253 / 15%);
}
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
