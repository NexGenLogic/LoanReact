<template>
    <form @submit.prevent="submit" class="popup-form">
        <div class="mb-3">
            <label class="label-main">Amount to Pay</label>
            <input
                type="number"
                class="input-main"
                v-model="payAmount"
                :max="maxAmount"
                min="1"
                :placeholder="`Enter amount (Max: ₹${maxAmount})...`"
            />
            <div class="hint-text">Maximum: ₹{{ maxAmount }}</div>
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
        
        <!-- ============================================= -->
        <!-- ============ NEW FILE INPUT FIELD =========== -->
        <!-- ============================================= -->
        <div class="mb-3" v-if="paymentMethod !== 'cash'">
    <label class="label-main">Reference Document</label>
    
    <!-- This is the actual file input, but it's hidden from view -->
    <input
        type="file"
        id="file-upload-input"
        @change="handleFileChange"
        accept="image/*,application/pdf"
        style="display: none;"
    />
    
    <!-- This is our beautiful, custom-styled replacement -->
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
        <!-- ============================================= -->
        
        <div v-if="errorMessage" class="error-msg mt-2 mb-3">{{ errorMessage }}</div>
    </form>
</template>

<script>
export default {
    name: "InvestmentRepaymentForm",
    props: {
        maxAmount: { type: Number, required: true }
    },
    data() {
        return {
            payAmount: "",
            paymentDate: new Date().toISOString().substr(0, 10),
            paymentMethod: "cash",
            referenceNo: "",
            // --- NEW DATA PROPERTY ---
            referenceDocument: null, 
            errorMessage: "",
        };
    },
    methods: {
        // --- NEW METHOD TO HANDLE FILE SELECTION ---
        handleFileChange(event) {
            this.referenceDocument = event.target.files[0];
        },
        validate() {
            if (!this.payAmount || this.payAmount <= 0) {
                this.errorMessage = "Enter a valid payment amount."; return false;
            }
            if (this.payAmount > this.maxAmount) {
                this.errorMessage = "Amount exceeds outstanding balance."; return false;
            }
            if (!this.paymentDate) {
                this.errorMessage = "Select a payment date."; return false;
            }
            if (!this.paymentMethod) {
                this.errorMessage = "Select a payment method."; return false;
            }
            // --- UPDATED VALIDATION LOGIC ---
            if (this.paymentMethod !== 'cash' && !this.referenceDocument) {
                this.errorMessage = "Reference document is required for this payment method.";
                return false;
            }
            this.errorMessage = "";
            return true;
        },
        submit() {
            if (this.validate()) {
                // --- UPDATED TO USE FormData FOR FILE UPLOAD ---
                const formData = new FormData();
                formData.append('amount', Number(this.payAmount));
                formData.append('payment_date', this.paymentDate);
                formData.append('payment_method', this.paymentMethod);
                formData.append('reference_number', this.referenceNo);

                // Append the file to the form data if it exists
                if (this.referenceDocument) {
                    // Use 'reference' as the key to match your new table field
                    formData.append('reference', this.referenceDocument);
                }
                
                // The parent component must now be ready to handle FormData
                this.$emit("payment_submit", formData);
            }
        }
    }
};
</script>

<style scoped>
/* Your existing styles remain unchanged */
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
}
.error-msg {
 color: #e53935;
 font-size: 0.97em;
 font-weight: 500;
}
.button-row {
 justify-content: flex-end;
 gap: 12px;
}
.btn-main {
 background: #198754;
 color: #fff;
 font-weight: 700;
 border: none;
 border-radius: 6px;
 padding: .62em 0;
 letter-spacing: .04em;
 box-shadow: 0 2px 10px #19875423;
 transition: background .15s;
}
.btn-main:hover, .btn-main:focus {
 background: #146c43;
 color: #e3ffe3;
}
.btn-soft {
 background: #f7fdfa;
 color: #198754;
 font-weight: 600;
 border: 1px solid #e0efee;
 border-radius: 6px;
 padding: .62em 0;
}
.btn-soft:hover, .btn-soft:focus {
 background: #e8fff4;
 color: #157347;
}
input:focus,
textarea:focus,
select:focus {
 outline: none;
 border-color: initial !important;
 box-shadow: none !important;
 border: initial !important;
}
.file-upload-label {
    display: flex; /* Aligns the "Browse" button and text side-by-side */
    align-items: center;
    width: 100%;
    border-radius: 7px;
    border: 1px solid #bcdbd9;
    background: #f7fdfc;
    transition: border-color .15s, background-color .15s;
    cursor: pointer; /* Makes it look clickable */
    overflow: hidden; /* Ensures the content doesn't spill out */
}

.file-upload-label:hover {
    border-color: #38b77c;
    background: #f3faf2;
}

/* This styles the "Browse" button part */
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

/* This styles the text part that shows the file name or placeholder */
.file-upload-text {
    padding-left: 1em;
    font-size: 0.98em;
    color: #6a8289;
    /* Prevents long file names from breaking the layout */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
