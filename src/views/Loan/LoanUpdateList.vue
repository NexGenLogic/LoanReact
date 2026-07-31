<template>
  <CardContainer title="Loans">
    <template #header-extra>
      <div class="d-flex align-items-center me-4 gap-3 flex-column flex-lg-row">
        <LoanSearch @merchant-search="search_clicked"/>
      </div>
    </template>
    <loan-component ref="loanComponent" :search_obj="merchant_obj"/>
  </CardContainer>
</template>

<script>
import LoanComponent from './LoanUpdateListComponent.vue';
import CardContainer from '../components/CardContainer.vue';
import LoanSearch from './LoanSearch.vue';

export default {
  name: "LoanList",
  components: {
    LoanComponent,
    CardContainer,
    LoanSearch
  },
  data() {
    return {
      merchant_obj: {}
    }
  },
  methods: {
    handleChange() {
      this.$router.push({ path: "/create-loan" });
    },
    search_clicked(merchant_options) {
      this.merchant_obj = merchant_options;
    },
    handleDownload() {
      // Call the download method on the child component using the ref
      this.$refs.loanComponent.downloadData();
    }
  }
};
</script>
