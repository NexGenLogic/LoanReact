<template>
  <div class="investment-payouts-panel bg-white p-4 rounded">
    <!-- Filter Header -->
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
        <material-button @click="searchPayouts" color="success" variant="gradient">Search</material-button>
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
          <th>Investment ID</th>
          <th>Investor</th>
          <th>Status</th>
          <th>Due Date</th>
          <th>Interest Paid</th>
          <th>Principal Paid</th>
          <th>Total Paid</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredPayouts" :key="item.id">
          <td>{{ item.investment_identifier }}</td>
          <td>{{ item.investor_name }}</td>
          <td>
            <span :class="{
              'badge bg-gradient-success': item.status === 'paid',
              'badge bg-gradient-warning': item.status === 'pending'
            }">
              {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
            </span>
          </td>
          <td>{{ formatDate(item.due_date) }}</td>
          <td>₹{{ item.interest_paid }}</td>
          <td>₹{{ item.principal_paid }}</td>
          <td>₹{{ item.total_paid }}</td>
          <td>{{ formatDateTime(item.updated_at) }}</td>
        </tr>
        <tr v-if="filteredPayouts.length === 0">
          <td colspan="8" class="text-center text-secondary py-3">
            No records found for selected filters.
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination -->
    <PaginationComponent
      :currentPage="pagination.current_page"
      :totalPages="pagination.last_page"
      @page-changed="searchPayouts"
    />
  </div>
</template>

<script>
import MaterialButton from "@/components/MaterialButton.vue";
import PaginationComponent from "../components/PaginationComponent.vue";
import { fetchInvestmentPayouts } from "@/utils/investment_services.js"; // Replace with your actual API utility
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: "InvestmentPayoutsTab",
  components: { MaterialButton, PaginationComponent },
  data() {
    return {
      fromDate: "",
      toDate: "",
      filteredPayouts: [],
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
    async searchPayouts(page = 1) {
      this.loading = true;
      const payload = {
        from_date: this.fromDate || "",
        to_date: this.toDate || "",
        page: page
      };
      try {
        const response = await fetchInvestmentPayouts(payload);
        this.filteredPayouts = response.data?.data?.data || [];
        this.pagination = {
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
          per_page: response.data.data.per_page,
          total: response.data.data.total
        };
      } catch (err) {
        this.filteredPayouts = [];
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      return dateString ? new Date(dateString).toLocaleDateString() : "N/A";
    },
    formatDateTime(dateTimeString) {
      return dateTimeString ? new Date(dateTimeString).toLocaleString() : "N/A";
    },
    handleExcelDownload() {
      if (!this.filteredPayouts.length) {
        alert("No data to download");
        return;
      }
      const headers = [
        'Investment ID', 'Investor', 'Status', 'Due Date',
        'Interest Paid', 'Principal Paid', 'Total Paid', 'Last Updated'
      ];
      const rows = this.filteredPayouts.map(p => [
        p.investment_identifier,
        p.investor_name,
        p.status,
        this.formatDate(p.due_date),
        p.interest_paid,
        p.principal_paid,
        p.total_paid,
        this.formatDateTime(p.updated_at)
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
      link.download = `investment_payouts_${timestamp}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handlePdfDownload() {
      if (!this.filteredPayouts.length) {
        alert("No data to download");
        return;
      }
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.setFontSize(18);
      const columns = [
        { header: 'Investment ID', dataKey: 'investmentId' },
        { header: 'Investor', dataKey: 'investorName' },
        { header: 'Status', dataKey: 'status' },
        { header: 'Due Date', dataKey: 'dueDate' },
        { header: 'Interest Paid', dataKey: 'interestPaid' },
        { header: 'Principal Paid', dataKey: 'principalPaid' },
        { header: 'Total Paid', dataKey: 'totalPaid' },
        { header: 'Last Updated', dataKey: 'updatedAt' }
      ];
      const rows = this.filteredPayouts.map(p => ({
        investmentId: p.investment_identifier,
        investorName: p.investor_name,
        status: p.status,
        dueDate: this.formatDate(p.due_date),
        interestPaid: p.interest_paid,
        principalPaid: p.principal_paid,
        totalPaid: p.total_paid,
        updatedAt: this.formatDateTime(p.updated_at)
      }));
      autoTable(doc, {
        head: [columns.map(c => c.header)],
        body: rows.map(row => columns.map(c => row[c.dataKey])),
        startY: 20,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [52, 152, 219] },
        didDrawPage: (data) => {
          doc.setFontSize(20);
          doc.setTextColor(40);
          doc.text("Investment Payouts Report", pageWidth / 2, 15, { align: 'center' });
          const pageCount = doc.internal.getNumberOfPages();
          doc.setFontSize(8);
          doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
      });
      const filename = `investment_payouts_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
    }
  },
  mounted() {
    // Auto-load on mount (optional)
    this.searchPayouts();
  }
};
</script>

<style scoped>
.investment-payouts-panel {
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
.badge {
  padding: 4px 16px;
  border-radius: 12px;
  font-size: 0.99em;
}
.bg-gradient-success {
  background: linear-gradient(90deg, #43e87f, #1cc88a);
  color: #fff;
}
.bg-gradient-warning {
  background: linear-gradient(90deg, #f6c41e, #f39c12);
  color: #fff;
}
</style>
