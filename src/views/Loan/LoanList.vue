<template>
  <CardContainer title="Loans">
    <template #header-extra>
      <div class="d-flex align-items-center me-4 gap-3 flex-column flex-lg-row"  v-if="!isCustomer">
        <material-button
          type="button"
          color="info"
          class="d-flex ms-2 mb-0"
          @click="showFilterPanel = !showFilterPanel"
        >
          <i class="material-icons-round opacity-10 fs-5 me-2">add</i>

          <span class="d-none d-lg-block">Advanced Search</span>
        </material-button>
        <LoanSearch @merchant-search="search_clicked"/>
        
        <!-- Download Button -->
        <material-button
          type="button"
          color="secondary"
          class="d-flex ms-2 mb-0 js-btn-next"
          @click="handleDownload"
        >
          <i class="material-icons-round opacity-10 fs-5 me-2">download</i>
          <span class="d-none d-lg-block">Download</span>
        </material-button>

        <!-- Create New Loan Button -->
        <material-button
          type="button"
          color="dark"
          class="d-flex ms-2 mb-0 js-btn-next"
          @click="handleChange"
          v-if="is_allowed('loans','create')"
        >
          <i class="material-icons-round opacity-10 fs-5 me-2">add_circle</i>
          <span class="d-none d-lg-block">Create New Loan</span>
        </material-button>
      </div>
    </template>
    <loan-component ref="loanComponent" :search_obj="merchant_obj"/>
  </CardContainer>
  <div v-if="showFilterPanel" class="advanced-filter-panel">
  <div class="panel-header d-flex align-items-center justify-content-between">
    <span class="panel-title"><b>Advanced Search</b></span>
    <button
      type="button"
      class="close-btn"
      @click="showFilterPanel = false"
      aria-label="Close"
    >
      X
    </button>
  </div>
    <div class="panel-body d-flex gap-3 align-items-end">
      <div>
        <label class="form-label mb-1">From Date:</label>
        <input type="date" v-model="fromDate" class="form-control"/>
      </div>
      <div>
        <label class="form-label mb-1">To Date:</label>
        <input type="date" v-model="toDate" class="form-control"/>
      </div>
      <div class="d-flex flex-column gap-2">
        <button type="button" class="btn btn-primary" @click="applyDatesAndClose">Apply Dates</button>
        <button type="button" class="btn btn-secondary" @click="clearDates">Clear Dates</button>
      </div>
    </div>
  </div>


</template>

<script>
import LoanComponent from './LoanComponent.vue';
import CardContainer from '../components/CardContainer.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import LoanSearch from './LoanSearch.vue';
import {getUserRole} from  "@/utils/api_services";
import { is_allowed } from "@/utils/api_services";

export default {
  name: "LoanList",
  components: {
    LoanComponent,
    CardContainer,
    MaterialButton,
    LoanSearch
  },
  data() {
    return {
      merchant_obj: {},
      isCustomer: false,
      showFilterPanel: false,
      fromDate: '',
      toDate: '',
    }
  },
  mounted() {
    this.isCustomer = getUserRole() == 'Customer'; 
  },
  methods: {
     is_allowed,
    handleChange() {
      this.$router.push({ path: "/create-loan" });
    },
    search_clicked(merchant_options) {
      console.log(merchant_options)
      // Merge with existing dates if they exist (use new dates if provided, otherwise preserve old ones)
      this.merchant_obj = {
        ...merchant_options,
        // Use dates from merchant_options if provided, otherwise preserve dates from existing merchant_obj
        from_date: merchant_options.from_date !== undefined ? merchant_options.from_date : (this.merchant_obj?.from_date || ''),
        to_date: merchant_options.to_date !== undefined ? merchant_options.to_date : (this.merchant_obj?.to_date || '')
      };
    },
    handleDownload() {
      // Call the download method on the child component using the ref
      this.$refs.loanComponent.downloadData();
    },
    applyDatesAndClose() {
      this.showFilterPanel = false;
      // Merge dates with existing search/status/page
      this.search_clicked({
        ...this.merchant_obj,
        from_date: this.fromDate,
        to_date: this.toDate
      });
    },
    clearDates() {
      // Clear date inputs
      this.fromDate = '';
      this.toDate = '';
      // Clear dates from merchant_obj and apply the change
      this.search_clicked({
        ...this.merchant_obj,
        from_date: '',
        to_date: ''
      });
    },
  }
};
</script>
<style scoped>
  .advanced-filter-panel {
    position: absolute;
    top: 170px; /* Adjust as needed */
    left: 50px; /* Adjust as needed */
    z-index: 2000;
    min-width: 420px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 10px 24px rgba(0,0,0,0.07);
    padding: 16px;
  }

  .panel-body {
    display: flex;
    gap: 18px;
    align-items: end;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.4em;
    line-height: 1;
    cursor: pointer;
  }
</style>
