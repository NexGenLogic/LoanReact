<template>
  <form @submit.prevent="submit" class="popup-form">
    <!-- Adjustment Type -->
    <div class="mb-3">
      <label class="label-main">Adjustment Type</label>
      <select class="input-main" v-model="form.type">
        <option value="late_fee">Late Fee</option>
        <option value="processing_fee">Processing Fee</option>
        <option value="waiver">Waiver</option>
        <option value="other_charge">Other</option>
        <option value="other_credit">Other Credits</option>
      </select>
    </div>

    <!-- Adjustment Amount -->
    <div class="mb-3">
      <label class="label-main">Adjustment Amount</label>
      <input
        type="number"
        class="input-main"
        v-model="form.amount"
        step="0.01"
        min="0"
        placeholder="Enter adjustment amount..."
      />
      <div class="hint-text">Enter a positive value to add a charge negetive to .</div>
    </div>
    <div class="mb-3">
      <label class="label-main">Adjustment Date</label>
      <input
        type="date"
        class="input-main"
        v-model="form.adjustment_date"
      />
    </div>
    <!-- Description -->
    <div class="mb-3">
        <label class="label-main">Description</label>
        <textarea 
            class="input-main" 
            v-model="form.description" 
            rows="3" 
            placeholder="e.g., Late payment fee for installment #3"
        ></textarea>
    </div>

    <!-- Apply to specific installment (optional) -->
    <div class="mb-3">
        <label class="label-main">Apply to Installment (Optional)</label>
        <select class="input-main" v-model="form.installment_id">
            <option :value="null">-- Select installment --</option>
            <option 
                 v-for="installment in installments.filter(inst => inst.status !== 'paid')" 
                :key="installment.id" 
                :value="installment.id"
            >
                Installment #{{ installment.installment_number }} (Due: {{ formatDate(installment.due_date) }})
            </option>
        </select>
        <div class="hint-text">Select an installment to apply this fee directly to it.</div>
    </div>

    <!-- Error Message Display -->
    <div v-if="errorMessage" class="error-msg mt-2 mb-3">{{ errorMessage }}</div>
  </form>
</template>

<script>
export default {
  name: "LoanAdjustmentForm",
  props: {
    // Pass the list of installments from the parent component
    installments: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        adjustment_date:new Date().toISOString().substr(0, 10),
        type: "late_fee",
        amount: null,
        description: "",
        installment_id: null, // This will hold the ID of the selected installment
      },
      errorMessage: "",
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '';
      
      return dateString.substring(0, 10);
    },
    validate() {
      if (typeof this.form.amount !== 'number' || this.form.amount === 0) {
        this.errorMessage = "Please enter a valid, non-zero adjustment amount.";
        return false;
        }

      if (!this.form.installment_id || this.form.installment_id == null) {
        this.errorMessage = "An installment is required.";
        return false;
      }

      if (!this.form.description || this.form.description.trim() === '') {
        this.errorMessage = "A description is required to explain the adjustment.";
        return false;
      }
      this.errorMessage = "";
      return true;
    },
    submit() {
      if (this.validate()) {
        const preciseAmount = Number(this.form.amount).toFixed(2);
        // Emit an event with the form data for the parent component to handle
        this.$emit("adjustment_submit", {
            amount: Number(preciseAmount),
            type: this.form.type,
            description: this.form.description,
            installment_id: this.form.installment_id,
            adjustment_date : this.form.adjustment_date
        });
      }
    }
  }
};
</script>

<style scoped>
/* I am using the exact same styles you provided for a consistent look */
.repayment-popup-container {
 background: #fff;
 border-radius: 14px;
 box-shadow: 0 5px 28px #19875434;
 padding: 0;
 min-width: 330px;
 max-width: 400px;
 margin: 0 auto;
}

.modal-header-custom {
 background: linear-gradient(90deg, #e7fbe9 60%, #f4fbf7 100%);
 border-top-left-radius: 14px;
 border-top-right-radius: 14px;
 padding: 20px 28px 16px 28px;
 border-bottom: 1px solid #e0efee;
}

.header-title {
 font-weight: 700;
 font-size: 1.22rem;
 color: #198754;
 letter-spacing: .01em;
}

.popup-form {
 padding: 2rem 1.9rem 1.3rem 1.9rem;
}

.label-main {
 font-weight: 600;
 color: #2b3a3b;
 margin-bottom: 6px;
 display: block;
 font-size: 1.05em;
}

.hint-text {
 color: #88a1a9;
 font-size: .96em;
 margin-top: 2px;
}

.input-main, textarea.input-main {
 display: block;
 width: 100%;
 border-radius: 7px;
 border: 1px solid #bcdbd9;
 font-size: 1.07em;
 padding: .57em 1em;
 margin-bottom: 2px;
 background: #f7fdfc;
 transition: border-color .15s;
  font-family: inherit; /* Ensures textarea inherits font */
}

.input-main:focus, textarea.input-main:focus {
 border-color: #38b77c;
 background: #f3faf2;
}

.error-msg {
 color: #e53935;
 font-size: 0.97em;
 font-weight: 500;
}

input:focus,
textarea:focus,
select:focus {
 outline: none;
 border-color: initial !important;
 box-shadow: none !important;
 border: initial !important;
}
</style>
