<template>
  <div class="loan-overdues-panel bg-white p-4 rounded ">
    <!-- Header/Search -->
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
        <material-button @click="searchRepayments" color="success" variant="gradient">Search</material-button>
      </div>
      <div>
        <material-button @click="handleExcelDownload" color="primary" variant="outline">Download Excel</material-button>
      </div>
      <div>
        <material-button @click="handlePdfDownload" color="info" variant="outline">Download PDF</material-button>
      </div>
    </div>

    <!-- Table -->
    <table class="table table-bordered align-middle">
      <thead>
        <tr class="table-light">
          <th>ID</th>
          <th>Loan ID</th>
          <th>Customer</th>
          <th>Amount</th>
          <th>Fee</th>
          <th>Payment Date</th>
          <th>Payment Method</th>
          <th>Reference Number</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredRepayments" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.loan_id }}</td>
          <td>{{ item.customer_name }}</td>
          <td>{{ formatAmount(item.amount) }}</td>
          <td>{{ formatAmount(item.fee) }}</td>
          <td>{{ formatDate(item.payment_date) }}</td>
          <td>{{ item.payment_method }}</td>
          <td>{{ item.reference_number }}</td>
        </tr>
        <tr v-if="filteredRepayments && filteredRepayments.length === 0">
          <td colspan="8" class="text-center text-secondary py-3">
            No records found for selected filters.
          </td>
        </tr>
      </tbody>
    </table>
        <PaginationComponent :currentPage="pagination.current_page" :totalPages="pagination.last_page"
        @page-changed="searchRepayments" />
  </div>
</template>

<script>
import { fetchLoanRepayments } from "@/utils/loan_services.js"; // implement this API call
import MaterialButton from "@/components/MaterialButton.vue";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from "@/assets/img/loan_app_logo_cropped.png";
import PaginationComponent from "../components/PaginationComponent.vue";

export default {
  name: "RepaymentReportTab",
  components : { MaterialButton, PaginationComponent },
  data() {
    return {
      fromDate: "",
      toDate: "",
      filteredRepayments: [],
      loading: false,
      pagination: {
                current_page: 1,
                last_page: 1,
                per_page: 10,
                total: 0
            }
    };
  },
  methods: {
    async searchRepayments(page=1) {
      this.loading = true;
      const payload = {
        from_date: this.fromDate || "",
        to_date: this.toDate || "",
        page : page
      };
      try {
        const response = await fetchLoanRepayments(payload); // API should return list of repayments
        console.log(response)
        this.filteredRepayments = response.data?.data?.data || [];
        this.pagination = {
                    current_page: response.data.data.current_page,
                    last_page: response.data.data.last_page,
                    per_page: response.data.data.per_page,
                    total: response.data.data.total
                };
      } catch (err) {
        this.filteredRepayments = [];
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    },
    formatAmount(amt) {
      const numberAmt = parseFloat(amt);
      return isNaN(numberAmt) ? '0.00' : numberAmt.toFixed(2);
    },
    handleExcelDownload() {
      if (!this.filteredRepayments.length) {
        alert("No data to download");
        return;
      }
      const headers = [
        'ID', 'Loan ID', 'Customer', 'Amount', 'Fee', 'Payment Date', 'Payment Method', 'Reference Number'
      ];
      const rows = this.filteredRepayments.map(p => [
        p.id,
        p.loan_id,
        p.customer_name,
        this.formatAmount(p.amount),
        this.formatAmount(p.fee),
        this.formatDate(p.payment_date),
        p.payment_method,
        p.reference_number
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
      link.download = `repayment_report_${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handlePdfDownload() {
      if (!this.filteredRepayments.length) {
        alert("No data to download");
        return;
      }
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(18);
    //   doc.text('Repayment Report', pageWidth / 2, 14, { align: 'center' });
      const columns = [
        { header: 'ID', dataKey: 'id' },
        { header: 'Loan ID', dataKey: 'loan_id' },
        { header: 'Customer', dataKey: 'customer_name' },
        { header: 'Amount', dataKey: 'amount' },
        { header: 'Fee', dataKey: 'fee' },
        { header: 'Payment Date', dataKey: 'payment_date' },
        { header: 'Payment Method', dataKey: 'payment_method' },
        { header: 'Reference Number', dataKey: 'reference_number' }
      ];
      const rows = this.filteredRepayments.map(p => ({
        id: p.id,
        loan_id: p.loan_id,
        customer_name: p.customer_name,
        amount: this.formatAmount(p.amount),
        fee: this.formatAmount(p.fee),
        payment_date: this.formatDate(p.payment_date),
        payment_method: p.payment_method,
        reference_number: p.reference_number
      }));

    //   autoTable(doc, {
    //     head: [columns.map(c => c.header)],
    //     body: rows.map(row => columns.map(col => row[col.dataKey])),
    //     startY: 20,
    //     theme: 'grid',
    //     styles: { fontSize: 8 },
    //     headStyles: { fillColor: [22, 160, 133] }
    //   });

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
        doc.text("Payment Report", pageWidth / 2, 65, { align: 'center' });
        
        doc.setFontSize(9);
        doc.setTextColor(100);
        
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });
      const filename = `repayment_report_${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(filename);
    }
  },
  mounted() {
    this.searchRepayments();
  }
}
</script>

<style scoped>
.loan-overdues-panel { background: #fff; border-radius: 18px; }
.form-label { font-weight: 600; color: #228B22; font-size: 1rem; }
.table th, .table td { vertical-align: middle; }
</style>
