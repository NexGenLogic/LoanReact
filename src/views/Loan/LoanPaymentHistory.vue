<template>
  <div class="card">
    <div class="card-body border-radius-lg">
      <!-- Search and Filter Panel -->
      <form class="row gx-3 gy-2 align-items-end mb-4" @submit.prevent="handleSearch">
        <div class="col-lg-4 col-md-12">
          <label class="form-label">Search (Ref. No., Method)</label>
          <input type="text" class="form-control" v-model="filters.searchText" placeholder="Search text..." />
        </div>
        <div class="col-lg-2 col-md-6">
          <label class="form-label">From Date</label>
          <input type="date" class="form-control" v-model="filters.fromDate" />
        </div>
        <div class="col-lg-2 col-md-6">
          <label class="form-label">To Date</label>
          <input type="date" class="form-control" v-model="filters.toDate" />
        </div>
        <div class="col-lg-4 col-md-12 d-flex justify-content-end gap-2">
          <button class="btn btn-success mb-0" type="submit">
            <i class="material-icons opacity-10">search</i> Search
          </button>
          <button class="btn btn-dark mb-0" type="button" @click="handleExcelDownload">
            Excel
          </button>
          <button class="btn btn-info mb-0" type="button" @click="handlePdfDownload">
            PDF
          </button>
        </div>
      </form>

      <!-- Payment History Table -->
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Amount</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Fee</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Method</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Remark</th>
              <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="isLoading">
              <td colspan="4" class="text-center p-4">
                <div class="spinner-border text-success" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="payments.length === 0">
              <td colspan="4" class="text-center p-4">No payment history found.</td>
            </tr>
            <tr v-for="payment in payments" :key="payment.id">
              <td><p class="text-sm font-weight-bold mb-0">{{ formatDate(payment.payment_date) }}</p></td>
              <td><p class="text-sm font-weight-bold mb-0">₹{{ formatAmount(payment.amount) }}</p></td>
              <td><p class="text-sm font-weight-bold mb-0">₹{{ formatAmount(payment.fee) }}</p></td>
              <td><span class="badge badge-sm bg-gradient-info">{{ payment.payment_method }}</span></td>
              <td><span class="text-sm font-weight-bold mb-0 ">{{ payment.notes }}</span></td>
              <td class="align-middle text-center">
                <span class="text-secondary text-sm font-weight-bold">{{ payment.reference_number }}</span>
                <span v-if="payment.reference" class="ms-2">
                  <a :href="payment.reference" target="_blank"><i class="fas fa-eye"></i></a>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import { fetchLoanPayments } from "@/utils/loan_services";
import logo from "@/assets/img/loan_app_logo_cropped.png";

export default {
  name: "PaymentHistory",
  props: {
    loanId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      loanDetails: null,
      payments: [],
      isLoading: false,
      filters: {
        searchText: "",
        fromDate: "",
        toDate: "",
      },
    };
  },
  methods: {
    getReferenceUrl(refPath) {
      // Assuming Laravel's 'public' disk. Adapt as needed if you use another storage disk or CDN.
      // If refPath is already a full URL, return as is.
      if (!refPath) return "#";
      if (refPath.startsWith("http")) return refPath;
      return `/storage/${refPath}`;
    },

    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    formatAmount(amt) {
      const numberAmt = parseFloat(amt);
      return isNaN(numberAmt) ? '0.00' : numberAmt.toFixed(2);
    },
    async loadPayments() {
      this.isLoading = true;
      try {
        const params = {
          search: this.filters.searchText,
          from: this.filters.fromDate,
          to: this.filters.toDate,
        };
        const response = await fetchLoanPayments(this.loanId, params);
        this.loanDetails = response.data.data.loan_details;
        this.payments = response.data.data.payments || [];
      } catch (error) {
        console.error("Failed to fetch payment history:", error);
      } finally {
        this.isLoading = false;
      }
    },
    handleSearch() {
      this.loadPayments();
    },
    handleExcelDownload() {
      // Your CSV/Excel download logic
    },
    handlePdfDownload() {
    if (!this.loanDetails) {
        alert("Loan details not loaded. Please try again.");
        return;
    }

    const doc = new jsPDF();
    const loan = this.loanDetails;
    const pageWidth = doc.internal.pageSize.getWidth();

    const tableColumn = ["Payment Date", "Amount", "Method", "Reference"];
    const tableRows = this.payments.map(p => [
        this.formatDate(p.payment_date),
        this.formatAmount(p.amount),
        p.payment_method,
        p.reference_number || '-',
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 85, 
        theme: 'grid',
        didDrawPage: (data) => {
        const logoWidth = 50;
        const logoHeight = 25;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);

        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("Payment Statement", pageWidth / 2, 45, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setTextColor(100);
        
        const leftColX = data.settings.margin.left;
        const rightColX = pageWidth / 2 + 10;
        let currentY = 55;

        doc.text(`Customer Name: ${loan.customer_name || 'N/A'}`, leftColX, currentY);
        doc.text(`Loan Amount: ${this.formatAmount(loan.loan_amount)}`, rightColX, currentY);
        currentY += 5;

        doc.text(`Loan A/C No: ${loan.loan_account_no || 'N/A'}`, leftColX, currentY);
        doc.text(`Interest Rate: ${loan.interest_rate}% (${loan.interest_type || 'N/A'})`, rightColX, currentY);
        currentY += 5;

        doc.text(`Loan Start Date: ${this.formatDate(loan.loan_start_date)}`, leftColX, currentY);
        doc.text(`Installment Amount: ${this.formatAmount(loan.installment_amount)}`, rightColX, currentY);
        currentY += 5;

        doc.text(`No. of Installments: ${loan.no_of_installments || 'N/A'}`, leftColX, currentY);
        doc.text(`Repayment: ${loan.repayment_frequency || 'N/A'}`, rightColX, currentY);
        
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        },
    });

    // FIX: Use the loan_account_no for the filename
    const fileName = `SPTM-LPS0000-${this.loanId || 'loan'}.pdf`;
    doc.save(fileName);
    },

  },
  mounted() {
    this.loadPayments();
  },
};
</script>
