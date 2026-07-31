<template>
  <div class="multisteps-form__panel border-radius-xl card" style="max-width: 1200px; margin:2rem auto;">
    <div class="multisteps-form__content">
      <!-- TABS -->
      <div class="tabs mb-3 bg-gradient-success">
        <button @click="activeTab = 'details'" :class="{ 'active-tab': activeTab === 'details' }">Investment Details</button>
        <button @click="activeTab = 'documents'" :class="{ 'active-tab': activeTab === 'documents' }" :disabled="!isEditing">Investment Documents</button>
        <button @click="activeTab = 'tenure'" :class="{ 'active-tab': activeTab === 'tenure' }" :disabled="!isEditing">Investment Tenure</button>
      </div>

      <!-- TAB CONTENT -->
      <div v-if="activeTab === 'details'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <form @submit.prevent="submitInvestmentDetails">
          <div class="grid-form">
            <!-- Investor -->
            <div>
              <label class="form-label" for="investor">Investor</label>
              <SearchableDropdown v-model="investment.investor_id" :options="investors" placeholder="Select an Investor..." />
              <div v-html="investorErr"></div>
            </div>

            <!-- Amount -->
            <div>
              <label class="form-label" for="amount">Amount</label>
              <input type="number" id="amount" class="form-control" v-model.number="investment.amount" required />
            </div>

            <!-- Interest -->
            <div>
              <label class="form-label" for="interest">Interest (%)</label>
              <input type="number" id="interest" class="form-control" v-model.number="investment.interest" step="0.01" required />
            </div>

            <div>
              <label class="form-label" for="duration">Investment Term</label>
              <input type="number" id="duration" v-model.number="investment.duration" required min="1" class="form-control" />
            </div>
            <div>
              <label class="form-label" for="term_period">Term Period</label>
              <select id="term_period" v-model="investment.term_period" class="form-select" required>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
           
            <div>
            <label class="form-label" for="interest_calculation_type">Interest Calculation</label>
            <select id="interest_calculation_type" class="form-select" v-model="investment.interest_calculation_type">
              <option value="simple">Simple</option>
              <option value="compound">Compound</option>
              <option value="local_finance">Local Finance</option>
            </select>
          </div>
        <div>
          <label class="form-label" for="payout_frequency">Interest Payout</label>
          <select id="payout_frequency" class="form-select" v-model="investment.payout_frequency">
            <option value="at_maturity">At Maturity</option>
            <option value="monthly" :disabled="investment.interest_calculation_type === 'compound'">Monthly</option>
            <option value="quarterly" :disabled="investment.interest_calculation_type === 'compound'">Quarterly</option>
            <option value="annually" :disabled="investment.interest_calculation_type === 'compound'">Annually</option>
          </select>
        </div>
          <div v-if="investment.interest_calculation_type === 'compound'">
              <label class="form-label" for="compounding_frequency">Compounding Frequency</label>
              <select id="compounding_frequency" class="form-select" v-model="investment.compounding_frequency">
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
            <!-- Payment Date -->
            <div>
              <label class="form-label" for="payment_date">Start Date</label>
              <input type="date" id="payment_date" class="form-control" v-model="investment.payment_date" required />
            </div>

            <!-- Payment Method -->
            <div>
                <label class="form-label" for="payment_method">Payment Method</label>
                <select id="payment_method" v-model="investment.payment_method" class="form-select" required>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <!-- Reference Number -->
            <div>
                <label class="form-label" for="reference_number">Reference Number</label>
                <input type="text" id="reference_number" class="form-control" v-model="investment.reference_number" />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="form-label" for="notes">Notes</label>
            <textarea id="notes" class="form-control" style="min-height:74px;" v-model="investment.notes"></textarea>
          </div>

          <div class="text-danger text-sm mb-3" v-html="error_html"></div>
          <div class="button-row d-flex mt-3 justify-content-end" v-if="is_allowed('investments','update')">
            <material-button type="submit" color="dark" variant="gradient" class="px-4 py-2" :disabled="loading">
              <span v-if="!loading">{{ isEditing ? 'Update' : 'Create' }} Investment</span>
              <PulseLoader v-if="loading" text="Saving" />
            </material-button>
          </div>
        </form>
      </div>

      <div v-if="activeTab === 'documents'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <InvestmentDocumentUploader :investmentId="investment_id" />
      </div>
      <div v-if="activeTab === 'tenure'" class="tab-content bg-white px-3 py-3 rounded-bottom">
        <InvestmentSchedule :investmentId="investment_id" :investment_obj="investment" @tenure-generated="refreshInvestmentData"  />
      </div>
    </div>
  </div>
</template>

<script>
import SearchableDropdown from '@/views/components/SearchableDropdown.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import PulseLoader from "../PulseLoader.vue";
import showSwal from "@/mixins/showSwal.js";
import { fetchInvestors } from "@/utils/investor_services"; 
import { createInvestment, updateInvestment, fetchInvestmentById } from "@/utils/investment_services";
import InvestmentDocumentUploader from './InvestmentDocumentUploader.vue';
import InvestmentSchedule from './InvestmentSchedule.vue';
import { is_allowed } from "@/utils/api_services"; 

export default {
  name: 'InvestmentForm',
  components: {
    SearchableDropdown,
    MaterialButton,
    PulseLoader,
    InvestmentDocumentUploader,
    InvestmentSchedule
  },
  props: {
    // 1. Renamed prop to match the route param `investmentId` directly.
    investmentId: {
      type: [Number, String], // Use String as well, as route params can be strings
      default: null
    }
  },
  data() {
    return {
      activeTab: 'details',
      isEditing: false,
      investors: [],
      investorErr: "",
      loading: false,
      investment_id: null, // Internal state for the ID
      error_html: "",
      // 2. Added new interest fields to the data model with defaults.
      investment: {
        investor_id: null,
        amount: null,
        interest: 0,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: 'cash',
        reference_number: '',
        notes: '',
        interest_calculation_type: 'simple',
        payout_frequency: 'at_maturity',
        compounding_frequency: null, 
        duration: 12,          // <-- default to 12 for backward compatibility (can be any default)
        term_period: 'months', // <-- default to 'months'
      }
    }
  },
  watch: {
    // 3. This watcher is crucial. It re-initializes the component if the route changes.
    investmentId: {
      immediate: true, // This makes it run on component load
      handler(newId) {
        this.initializeComponent(newId);
      }
    },
    'investment.interest_calculation_type'(newVal) {
        if (newVal === 'compound') {
          this.investment.payout_frequency = 'at_maturity';
        }
        else if (newVal === 'local_finance') {
          this.investment.payout_frequency = 'monthly'; // Local finance usually pays monthly
        }
      },
  },
  methods: {
    is_allowed,
    async initializeComponent(id) {
      this.loading = true;
      this.resetForm(); // Start with a clean slate
      try {
        const promises = [fetchInvestors()];

        // 4. If an ID is present (edit mode), fetch the investment data.
        if (id) {
          this.isEditing = true;
          this.investment_id = id;
          promises.push(fetchInvestmentById(id));
        }

        const [investorResponse, investmentResponse] = await Promise.all(promises);
        
        this.investors = investorResponse.data.data.investors.data.filter(investor => investor.active == 1);

        // If investmentResponse exists, populate the form with its data.
        if (investmentResponse) {
          const investmentData = investmentResponse.data.data;
          this.investment = { ...this.investment, ...investmentData };
        }
      } catch (error) {
        console.error("Failed to initialize component:", error);
        this.error_html = "<div style='color:red'>Failed to load required data.</div>";
        // Optionally redirect if the investment is not found
        if (error.response && error.response.status === 404) {
            this.$router.push({ name: 'InvestmentsList' }); // Or your list route
        }
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      // 5. Ensure the reset method clears all fields.
      this.investment = {
        investor_id: null,
        amount: null,
        interest: 0,
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: 'cash',
        reference_number: '',
        notes: '',
        interest_calculation_type: 'simple',
        payout_frequency: 'at_maturity',
        compounding_frequency: null,
      };
      this.investment_id = null;
      this.isEditing = false; // Reset editing state
      this.investorErr = "";
      this.error_html = "";
    },
    async submitInvestmentDetails() {
      if (!this.investment.investor_id) {
        this.investorErr = "<div style='color:red'> Please select an investor </div>";
        return;
      }
      this.investorErr = "";
      this.loading = true;
      this.error_html = "";

      // Ensure compounding_frequency is null if interest is simple
      const payload = { ...this.investment };
      if (payload.interest_calculation_type === 'simple') {
          payload.compounding_frequency = null;
      }
      
      try {
        if (this.isEditing) {
          // --- UPDATE INVESTMENT ---
          await updateInvestment(this.investment_id, payload);
          showSwal.methods.showSwal({
            type: "success",
            message: "Investment updated successfully!",
          });
          // Optional: You might want to refresh data after update
          // this.initializeComponent(this.investment_id);
        } else {
          // --- CREATE INVESTMENT ---
          const response = await createInvestment(payload);
          this.investment_id = response.data.data.id;
          this.isEditing = true;
          showSwal.methods.showSwal({
            type: "success",
            message: "Investment created! You can now upload documents.",
          });
          // Update the browser URL to the new edit URL without a full reload
          this.$router.replace({ name: 'Investment Edit', params: { investmentId: this.investment_id } });
          this.activeTab = 'documents';
        }
      } catch(error) {
        let errorMessage = "An error occurred. Please try again.";
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }
        this.error_html = `<div style='color:red'>${errorMessage}</div>`;
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
input[type="text"],
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
input[type="text"]:focus,
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
