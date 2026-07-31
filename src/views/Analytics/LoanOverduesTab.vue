<template>
  <div class="loan-overdues-panel bg-white p-4 rounded ">
    <!-- Header Search -->
    <div class="d-flex flex-wrap align-items-end mb-4" style="gap: 18px;">
      <div>
        <label class="form-label mb-1">From Date</label>
        <input type="date" v-model="fromDate" class="form-control"/>
      </div>
      <div>
        <label class="form-label mb-1">To Date</label>
        <input type="date" v-model="toDate" class="form-control"/>
      </div>
        <div>
        
        </div>
      <div>
        
        <material-button  @click="searchLoans" color="success" variant="gradient">Search</material-button></div>
       <div> <material-button @click="handleExcelDownload" color="primary" variant="outline">Download Excel</material-button>
  </div>
  <div>
    <material-button @click="handlePdfDownload" color="info" variant="outline">Download PDF</material-button>
      </div>
    </div>

    <!-- Table -->
    <table class="table table-bordered align-middle">
        <thead>
            <tr class="table-light">
            <th>Loan ID</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Days Overdue</th>
             <th>Due Date</th>
            <th>Amount</th>
            <th>Last Payment</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in filteredLoans" :key="item.loanId">
            <td>{{ item.loanId }}</td>
            <td>{{ item.customer }}</td>
            <td>
                <span :class="{'text-success': item.status.toLowerCase() === 'current', 'text-danger': item.status.toLowerCase() === 'overdue'}">
                {{ item.status }}
                </span>
            </td>
            <td>
                <!-- Show days_overdue of earliest overdue installment or 0 -->
                {{ getEarliestDaysOverdue(item.overdue_installments) }}
            </td>
            <td>
                {{ 
                    item.overdue_installments && item.overdue_installments.length > 0
                    ? formatDate(item.overdue_installments[0].due_date)
                    : 'N/A'
                }}
                </td>
            <td>{{ item.amount }}</td>
            <td>{{ item.last_payment ? formatDate(item.last_payment) : 'N/A' }}</td>
            </tr>
            <tr v-if="filteredLoans && filteredLoans.length === 0">
            <td colspan="6" class="text-center text-secondary py-3">
                No records found for selected filters.
            </td>
            </tr>
        </tbody>
    </table>
    <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
        @page-changed="searchLoans" />
  </div>
</template>

<script>
import { fetchLoanOverdues } from "@/utils/loan_services.js";
import MaterialButton from "@/components/MaterialButton.vue";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from "@/assets/img/loan_app_logo_cropped.png";
import PaginationComponent from "../components/PaginationComponent.vue";

export default {
  name: "LoanOverduesTab",
  components: { MaterialButton, PaginationComponent },
  // 1. ADD PROPS HERE
  props: {
    initialDate: {
      type: String,
      default: ''
    },
    filterMode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fromDate: "",
      toDate: "",
      selectedStatus: "",
      filteredLoans: [],
      loading: false,
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0
      }
    };
  },
  // 2. ADD MOUNTED HOOK HERE
  mounted() {
    // If a date is passed (e.g., from Dashboard "Due Today"), set it
    if (this.initialDate) {
      this.fromDate = this.initialDate;
      this.toDate = this.initialDate; // Set both to same day to filter specifically for "Today"
      
      // Auto-trigger the search so the user sees results immediately
      this.searchLoans();
    }
  },
  methods: {
    async searchLoans(page = 1) {
      this.loading = true;
      const payload = {
        from_date: this.fromDate || "",
        to_date: this.toDate || "",
        status: this.selectedStatus || "",
        page: page
      };
      try {
        const response = await fetchLoanOverdues(payload);
        this.filteredLoans = response.data?.data?.data || [];
        this.pagination = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        };
      } catch (err) {
        this.filteredLoans = [];
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    },

    getEarliestDaysOverdue(overdueInstallments) {
      if (!overdueInstallments || overdueInstallments.length === 0) return 0;
      const daysArr = overdueInstallments.map(i => i.days_overdue);
      return Math.min(...daysArr);
    },

    handleExcelDownload() {
      if (!this.filteredLoans.length) {
        alert("No data to download");
        return;
      }
      const headers = [
        'Loan ID', 'Customer', 'Status', 'Days Overdue', 'Due Date', 'Amount', 'Last Payment'
      ];

      const rows = this.filteredLoans.map(l => [
        l.loanId,
        l.customer,
        l.status,
        this.getEarliestDaysOverdue(l.overdue_installments),
        (l.overdue_installments && l.overdue_installments[0]) ? this.formatDate(l.overdue_installments[0].due_date) : 'N/A',
        l.amount,
        l.last_payment ? this.formatDate(l.last_payment) : 'N/A'
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
      link.download = `loan_overdues_${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    handlePdfDownload() {
      if (!this.filteredLoans.length) {
        alert("No data to download");
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(18);


      const columns = [
        { header: 'Loan ID', dataKey: 'loanId' },
        { header: 'Customer', dataKey: 'customer' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Days Overdue', dataKey: 'daysOverdue' },
        { header: 'Due Date', dataKey: 'dueDate' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Last Payment', dataKey: 'lastPayment' }
      ];

      const rows = this.filteredLoans.map(l => ({
        loanId: l.loanId,
        customer: l.customer,
        status: l.status,
        daysOverdue: this.getEarliestDaysOverdue(l.overdue_installments),
        dueDate: (l.overdue_installments && l.overdue_installments[0]) ? this.formatDate(l.overdue_installments[0].due_date) : 'N/A',
        amount: l.amount,
        lastPayment: l.last_payment ? this.formatDate(l.last_payment) : 'N/A'
      }));

      autoTable(doc, {
        head: [columns.map(c => c.header)],
        body: rows.map(row => columns.map(c => row[c.dataKey])),
        startY: 85,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [22, 160, 133] },
        didDrawPage: (data) => {
          const logoWidth = 50;
          const logoHeight = 50;
          const logoX = (pageWidth - logoWidth) / 2;
          doc.addImage(logo, 'PNG', logoX, 10, logoWidth, logoHeight);
          doc.setFontSize(20);
          doc.setTextColor(40);
          doc.text("Loan Overdues Report", pageWidth / 2, 65, { align: 'center' });

          doc.setFontSize(9);
          doc.setTextColor(100);

          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);

          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });

      const filename = `loan_overdues_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
    }
  }
}
</script>

<style scoped>
.loan-overdues-panel {
  background: #fff;
  border-radius: 18px;
}
.form-label {
  font-weight: 600;
  color: #228B22;
  font-size: 1rem;
}
.table th, .table td {
  vertical-align: middle;
}
</style>
