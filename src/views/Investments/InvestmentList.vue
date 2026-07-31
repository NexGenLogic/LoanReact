<template>
  <CardContainer title="Investments">
    <template #header-extra>
      <div class="d-flex align-items-center me-4 gap-3 flex-column flex-lg-row" v-if="!isInvestor">
        <InvestmentSearch @merchant-search="search_clicked"/>
        
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
          @click="createInvestment"
          v-if="is_allowed('investments','create')"
        >
          <i class="material-icons-round opacity-10 fs-5 me-2">add_circle</i>
          <span class="d-none d-lg-block">Create New Investment</span>
        </material-button>
      </div>
    </template>
    <investment-component ref="InvestmentComponent" :search_obj="merchant_obj"/>
  </CardContainer>
</template>

<script>
import InvestmentComponent from './InvestmentComponent.vue';
import CardContainer from '../components/CardContainer.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import InvestmentSearch from './InvestmentSearch.vue';
import {getUserRole} from  "@/utils/api_services";
import { is_allowed } from "@/utils/api_services";

export default {
  name: "InvestmentList",
  components: {
    InvestmentComponent,
    CardContainer,
    MaterialButton,
    InvestmentSearch
  },
  data() {
    return {
      merchant_obj: {},
      isInvestor: false,
    }
  },
  mounted() {
    this.isInvestor = getUserRole() == 'Investor'; 
  },
  methods: {
     is_allowed,
    createInvestment() {
      this.$router.push({ path: "/create-investment" });
    },
    search_clicked(merchant_options) {
      this.merchant_obj = merchant_options;
    },
    handleDownload() {
      // Call the download method on the child component using the ref
      this.$refs.InvestmentComponent.downloadData();
    }
  }
};
</script>
