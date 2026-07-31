<template>
    <form @submit.prevent="submit" class="popup-form">
        
        <div class="summary-box mb-4">
            <div class="d-flex justify-content-between mb-1">
                <strong>Outstanding Balance:</strong>
                <span class="amount-figure text-danger">&#8377;{{ totalOutstanding.toFixed(2) }}</span>
            </div>
            
            <div class="d-flex justify-content-between mb-1">
                <strong>Closure Fee (2%):</strong>
                <span class="amount-figure text-info">&#8377;{{ closureFee.toFixed(2) }}</span>
            </div>
            
            <hr class="my-2">
            
            <div class="d-flex justify-content-between align-items-center">
                <strong class="text-success fs-5">Total Payoff:</strong>
                <span class="amount-figure text-success fs-4">&#8377;{{ payoffTotal.toFixed(2) }}</span>
            </div>
            
            <div class="alert alert-light mt-2 mb-0 p-2 text-center" style="font-size: 0.85em; color: #666; border: 1px solid #eee;">
                Includes full interest for the loan tenure.
            </div>
        </div>
        <div class="mb-3">
            <label class="label-main">Date of Payment</label>
            <input
                type="date"
                class="input-main"
                v-model="paymentDate"
            />
        </div>
        <div class="mb-3">
            <label class="label-main">Payment Method</label>
            <select class="input-main" v-model="paymentMethod">
                <option value="cash">Cash</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="card">Card</option>
                <option value="upi">UPI</option>
                <option value="online">Online</option>
                <option value="other">Other</option>
            </select>
        </div>
        <div class="mb-3">
            <label class="label-main">Reference No.</label>
            <input
                type="text"
                class="input-main"
                v-model="referenceNo"
                placeholder="Transaction/Cheque/UPI ID"
            />
        </div>
        
        <div class="mb-3" v-if="paymentMethod !== 'cash'">
            <label class="label-main">Reference Document</label>
            
            <input
                type="file"
                id="file-upload-input"
                ref="fileInput"
                @change="handleFileChange"
                accept="image/*,application/pdf"
                style="display: none;"
            />
            
            <label for="file-upload-input" class="file-upload-label">
                <span class="file-upload-button">
                    Browse
                </span>
                <span class="file-upload-text">
                    {{ referenceDocument ? referenceDocument.name : 'Click to upload a file...' }}
                </span>
            </label>

            <div class="hint-text">Required for this payment method. (PDF, JPG, PNG)</div>
        </div>
        
        <div v-if="errorMessage" class="error-msg mt-2 mb-3">{{ errorMessage }}</div>
    </form>
</template>

<script>
export default {
    name: "EarlyClosureForm",
    props: {
        // We receive these values from the parent LoanSchedule.vue
        principalOutstanding: { type: Number, default: 0 }, // Kept for prop compatibility, though not displayed
        totalOutstanding: { type: Number, default: 0 },
        closureFee: { type: Number, default: 0 },
        payoffTotal: { type: Number, default: 0 }
    },
    data() {
        return {
            paymentDate: new Date().toISOString().substr(0, 10),
            paymentMethod: "cash",
            referenceNo: "",
            referenceDocument: null, 
            errorMessage: "",
        };
    },
    methods: {
        handleFileChange(event) {
            this.referenceDocument = event.target.files[0];
        },
        resetForm() {
            this.paymentDate = new Date().toISOString().substr(0, 10);
            this.paymentMethod = "cash";
            this.referenceNo = "";
            this.referenceDocument = null;
            this.errorMessage = "";
            if (this.$refs.fileInput) {
                this.$refs.fileInput.value = "";
            }
        },
        validate() {
            if (!this.paymentDate) {
                this.errorMessage = "Select a payment date."; return false;
            }
            if (!this.paymentMethod) {
                this.errorMessage = "Select a payment method."; return false;
            }
            if (this.paymentMethod !== 'cash' && !this.referenceDocument) {
                this.errorMessage = "Reference document is required for this payment method.";
                return false;
            }
            this.errorMessage = "";
            return true;
        },
        submit() {
            if (this.validate()) {
                const formData = new FormData();
                formData.append('payment_date', this.paymentDate);
                formData.append('payment_method', this.paymentMethod);
                if (this.referenceNo) formData.append('reference_number', this.referenceNo);
                if (this.referenceDocument) {
                    formData.append('reference', this.referenceDocument);
                }
                
                this.$emit("early_closure_submit", formData);
            }
        }
    }
};
</script>

<style scoped>
/* Add the summary box style */
.summary-box {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 15px;
}

/* Add amount-figure style locally so it works inside the component */
.amount-figure {
    font-family: 'Roboto', sans-serif; /* Or your app's font */
    font-weight: 700;
    letter-spacing: 0.5px;
}

/* Existing Styles */
.repayment-popup-container {
 background: #fff;
 border-radius: 14px;
 box-shadow: 0 5px 28px #19875434;
 padding: 0;
 min-width: 330px;
 max-width: 400px;
 margin: 0 auto;
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
.input-main {
 display: block;
 width: 100%;
 border-radius: 7px;
 border: 1px solid #bcdbd9;
 font-size: 1.07em;
 padding: .57em 1em;
 margin-bottom: 2px;
 background: #f7fdfc;
 transition: border-color .15s;
}
.input-main:focus {
 border-color: #38b77c;
 background: #f3faf2;
 outline: none; /* Fixed outline issue */
}
.error-msg {
 color: #e53935;
 font-size: 0.97em;
 font-weight: 500;
}
.file-upload-label {
    display: flex; 
    align-items: center;
    width: 100%;
    border-radius: 7px;
    border: 1px solid #bcdbd9;
    background: #f7fdfc;
    transition: border-color .15s, background-color .15s;
    cursor: pointer; 
    overflow: hidden; 
}
.file-upload-label:hover {
    border-color: #38b77c;
    background: #f3faf2;
}
.file-upload-button {
    background: #e7fbe9;
    padding: .65em 1.2em;
    font-weight: 600;
    color: #198754;
    border-right: 1px solid #bcdbd9;
    transition: background-color .15s;
}
.file-upload-label:hover .file-upload-button {
    background-color: #d6f5d9;
}
.file-upload-text {
    padding-left: 1em;
    font-size: 0.98em;
    color: #6a8289;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>