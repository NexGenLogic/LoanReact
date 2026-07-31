<template>
  <div class="investment-schedule-container table-responsive">
    <!-- Loading State -->
    <div v-if="loading" class="text-center p-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Loading Schedule...</p>
    </div>
    <!-- No Payouts: Show Button -->
    <div v-else-if="!payouts.length" class="text-center p-5">
      <p class="text-muted mb-4">No payout schedule has been generated for this investment yet.</p>
      <button class="btn btn-dark px-4 py-2" :disabled="generating" @click="handleGenerateTenure"  v-if="is_allowed('investments','update')">
        <span v-if="!generating">Generate Tenure <i class="material-icons align-middle me-2">playlist_add</i></span>
        <span v-else>
          <span class="spinner-border spinner-border-sm me-2"></span>
          Generating...
        </span>
      </button>
      <div v-if="apiError" class="text-danger mt-3">{{ apiError }}</div>
    </div>
    <!-- Investor Schedule Table and Details -->
    <div v-else>
      <div class="mt-4">
        <div class="card-header pb-0 p-3">
          <div class="row">
            <div class="col-md-6 d-flex align-items-center">
              <span class="badge badge-sm" :class="(investment_obj.status === 'active' || investment_obj.status === 'completed') ? 'bg-gradient-success' : 'bg-gradient-danger'" >
                {{ investment_status[investment_obj.status] || investment_obj.status }}
              </span>
            </div>
            <div class="col-md-6 text-end d-flex justify-content-end gap-2" v-if="investment_obj.status === 'active'">
              <material-button color="primary" variant="gradient" @click="downloadPdf">
                <i class="fas fa-file-pdf me-2"></i>
                Download PDF
              </material-button>
            </div>
          </div>
        </div>
        <div class="card-body p-3">
          <div class="row mb-md-0 mb-4">
            <div class="ccard card-body border card-plain border-radius-lg d-flex align-items-center flex-row w-100">
              <div class="fw-bold text-info">
                <table>
                  <tr>
                    <td>Principal</td>
                    <td>:</td>
                    <td><span class="amount-figure text-primary">₹{{ toFixed(investment_obj.amount) }}</span></td>
                  </tr>
                  <tr>
                    <td><span class=" text-info">Interest</span></td>
                    <td>:</td>
                    <td>
                      <span class="amount-figure" :class="totalOutstanding > 0 ? 'text-danger' : 'text-success'">
                         {{ investment_obj.interest }}%
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Start Date</td>
                    <td>:</td>
                    <td>
                      {{ formatDate(investment_obj.payment_date) }}
                    </td>
                  </tr>
                  <tr>
                    <td>Mature Date</td>
                    <td>:</td>
                    <td>
                      {{ formatDate(investment_obj?.maturity_date) }}
                    </td>
                  </tr>
                   <tr>
                    <td>Term Period</td>
                    <td>:</td>
                    <td>
                      {{ investment_obj.duration ?? '--'}} {{ investment_obj.term_period ?? '--' }}
                    </td>
                  </tr>
                  
                </table>
              </div>
              <div class="ms-auto fw-bold text-info">
                <table>
                  <tr>
                    <td>Investor</td>
                    <td>:</td>
                    <td style="text-transform: uppercase;">
                     {{ investment_obj.investor.name }}
                    </td>
                  </tr>
                  <tr>
                    <td>Identifier</td>
                    <td>:</td>
                    <td><span class="amount-figure text-primary">{{ investment_obj.investment_identifier }}</span></td>
                  </tr>
                  <tr>
                    <td>Payout Frequency</td>
                    <td>:</td>
                    <td>
                      <span class="amount-figure" :class="totalOutstanding > 0 ? 'text-danger' : 'text-success'">
                        {{ payoutFrequencyFormatted }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Interest Calculation</td>
                    <td>:</td>
                    <td>
                      {{ formatInterestType(investment_obj.interest_calculation_type) }}
                    </td>
                  </tr>
                  
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table class="table align-items-center mb-0 mt-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Payout Date</th>
            <th>Payout Type</th>
            <th>Interest Amount</th>
            <th>Principal Credited</th>
            <th>Cumulative Credited</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payout, idx) in payouts" :key="payout.id">
            <td>{{ idx + 1 }}</td>
            <td>{{ formatDate(payout.due_date) }}</td>
            <td>
              <span v-if="payout.principal_paid > 0 && payout.interest_paid > 0">Interest + Principal</span>
              <span v-else-if="payout.principal_paid > 0">Principal Returned</span>
              <span v-else>Interest</span>
            </td>
            <td>₹{{ toFixed(payout.interest_paid) }}</td>
            <td>₹{{ toFixed(payout.principal_paid) }}</td>
            <td>₹{{ cumulativeCredited(idx) }}</td>
           <td>
              <span 
                class="badge badge-sm"
                :class="payout.status === 'paid' ? 'bg-gradient-success' : 'bg-gradient-warning'"
              >
                {{ payout.status === 'paid' ? 'Paid' : payout.status === 'pending' ? 'Pending' : payout.status }}
              </span>
            </td>
             <td> 
              <button 
                v-if="payout.status !== 'paid'" 
                class="btn btn-success btn-sm" 
                @click="markAsPaid(payout.id)"
                title="Mark as Paid"
                style="margin-top: 15px;"
              >
                <i class="fas fa-check-circle"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import { fetchInvestmentInstallments, generateInvestmentSchedule, installmentMarkAsPaid } from '@/utils/investment_services';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from "@/assets/img/loan_app_logo_cropped.png";
import { is_allowed } from "@/utils/api_services"; 
import showSwal from "@/mixins/showSwal.js";

export default {
  name: 'InvestmentSchedule',
  props: {
    investmentId: { type: Number, default: null },
    investment_obj: { type: Object, default: () => ({}) }
  },
  components: {
    MaterialButton
  },
  data() {
    return {
      payouts: [],
      investment_status: {
        'active': 'Active',
        'pending_approval': "Pending Approval",
        'paid_off': "Paid Off",
        'overdue': "Overdue",
        'cancelled': 'Cancelled',
        'defaulted': 'Defaulted'
      },
      loading: false,
      generating: false,
      apiError: "",
    };
  },
  computed: {
    payoutFrequencyFormatted() {
      if (!this.investment_obj.payout_frequency) return '';
      // Replace underscores with spaces and capitalize each word
      return this.investment_obj.payout_frequency
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  },
  watch: {
    investmentId: {
      handler(newId) {
        if (newId) this.fetchPayouts(newId);
        else this.payouts = [];
      },
      immediate: true
    }
  },
  methods: {
    formatInterestType(text) {
      if (!text) return '';
      // 1. Replace underscores with spaces
      // 2. Capitalize the first letter of every word
      return text.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    },
    async markAsPaid(payoutId) {
      try {
        // Send request to backend to mark payout as paid
        await installmentMarkAsPaid(payoutId);
        // this.$axios.post(`/api/investment-payouts/${payoutId}/mark-as-paid`);
        // Refresh the payouts list
        await this.fetchPayouts(this.investmentId);
        showSwal.methods.showSwal({ type: "success", message: "Documents saved successfully!" });
      } catch (err) {
        
        showSwal.methods.showSwal({ type: "success", message: "Failed to mark payout as paid." });
      }
    },
    is_allowed,
   downloadPdf() {
  if (!this.payouts.length) {
    alert("No schedule data to download.");
    return;
  }
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Table columns and rows
  const tableColumn = [
    "#",
    "Payout Date",
    "Payout Type",
    "Interest Amount",
    "Principal Credited",
    "Cumulative Credited"
  ];
  const tableRows = this.payouts.map((row, idx) => [
    (idx + 1).toString(),
    this.formatDate(row.due_date),
    row.principal_paid > 0 && row.interest_paid > 0
      ? "Interest + Principal"
      : (row.principal_paid > 0 ? "Principal Returned" : "Interest"),
    "INR " + (Number(row.interest_paid || 0).toFixed(2)),
    "INR " + (Number(row.principal_paid || 0).toFixed(2)),
    "INR " + (Number(this.cumulativeCredited(idx)) || 0).toFixed(2)
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 125,
    theme: 'grid',
    didDrawPage: (data) => {
      // Print header only on the first page!
      if (doc.internal.getCurrentPageInfo().pageNumber === 1) {
        const logoWidth = 50;
        const logoHeight = 50;
        const logoX = (pageWidth - logoWidth) / 2;
        doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);

        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text("Payout Schedule", pageWidth / 2, 65, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);

        const leftColX = data.settings.margin.left;
        const rightColX = pageWidth / 2 + 15;
        let currentY = 85;

        doc.text(`Investor: ${this.investment_obj.investor?.name || '-'}`, leftColX, currentY);
        doc.text(`ID: ${this.investment_obj.investment_identifier || '-'}`, rightColX, currentY);
        currentY += 7;

        doc.text(`Principal: INR ${Number(this.investment_obj.amount || 0).toFixed(2)}`, leftColX, currentY);
        doc.text(`Interest: ${this.investment_obj.interest}% (${this.investment_obj.interest_calculation_type || '-'})`, rightColX, currentY);
        currentY += 7;

        doc.text(`Start Date: ${this.formatDate(this.investment_obj.payment_date)}`, leftColX, currentY);
        doc.text(`Payout Frequency: ${this.investment_obj.payout_frequency || '-'}`, rightColX, currentY);
        currentY += 7;
        const rawType = this.investment_obj.interest_calculation_type || '-';
        const formattedType = rawType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

        doc.text(`Maturity Date: ${this.formatDate(this.investment_obj.maturity_date)}`, leftColX, currentY);
        doc.text(`Interest Type: ${formattedType}`, rightColX, currentY);
        currentY += 7;

         doc.text(`Term Period: ${this.formatDate(this.investment_obj.maturity_date)}`, leftColX, currentY);
        doc.text(`Interest Calculation: ${this.investment_obj.duration || '-'} ${this.investment_obj.term_period || '-'}`, rightColX, currentY);
        currentY += 7;
      }

      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(9);
      doc.setTextColor(130);
      doc.text(
        `Page ${doc.internal.getCurrentPageInfo().pageNumber} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      );
    }
  });





      // // Page number
      // const pageCount = doc.internal.getNumberOfPages();
      // for (let i = 1; i <= pageCount; i++) {
      //   doc.setPage(i);
      //   doc.setFontSize(8);
      //   doc.setTextColor(150);
      //   doc.text(`Page ${i} of ${pageCount}`, leftColX, doc.internal.pageSize.height - 8);
      // }

      doc.save(`investment_schedule_${this.investment_obj.investment_identifier || "report"}.pdf`);
    },
    async fetchPayouts(id) {
      this.loading = true;
      this.apiError = "";
      try {
        const response = await fetchInvestmentInstallments(id);
        this.payouts = response.data.data;
      } catch (error) {
        console.error("Failed to fetch investment payouts:", error);
        this.payouts = [];
      } finally {
        this.loading = false;
      }
    },
    async handleGenerateTenure() {
      if (!this.investmentId) return;
      this.generating = true;
      this.apiError = "";
      try {
        await generateInvestmentSchedule(this.investmentId);
        await this.fetchPayouts(this.investmentId);
      } catch (err) {
        this.apiError = err?.response?.data?.message || 'Failed to generate schedule. Please try again.';
      } finally {
        this.generating = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '-';
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    },
    toFixed(value) {
      return parseFloat(value || 0).toFixed(2);
    },
    cumulativeCredited(idx) {
      let sum = 0;
      for (let i = 0; i <= idx; i++) {
        sum += parseFloat(this.payouts[i].interest_paid || 0);
        sum += parseFloat(this.payouts[i].principal_paid || 0);
      }
      return sum.toFixed(2);
    }
  }
};
</script>

<style scoped>
.amount-figure {
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 0.02em;
  margin-left: 0.2em;
}
.table th, .table td {
  font-size: 0.98em;
}
.badge {
  font-size: 0.94em;
}
</style>
