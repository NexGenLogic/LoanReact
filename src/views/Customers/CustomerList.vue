<template>
  <CardContainer title="Customers">
    <template #header-extra>
      <div class="d-flex align-items-center me-4 gap-3 flex-column flex-lg-row">
        <CustomerSearch @merchant-search="search_clicked" />
        
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

        <!-- Create New Customer Button -->
        <material-button
          type="button"
          color="dark"
          class="d-flex ms-2 mb-0 js-btn-next"
          @click="handleChange"
          v-if="is_allowed('customers','create')"
        >
          <i class="material-icons-round opacity-10 fs-5 me-2">add_circle</i>
          <span class="d-none d-lg-block">Create New Customer</span>
        </material-button>
      </div>
    </template>
    <customer-component ref="customerComponent" :search_obj="merchant_obj" />
  </CardContainer>
</template>

<script>
import CustomerComponent from './CustomerComponent.vue';
import CardContainer from '../components/CardContainer.vue';
import MaterialButton from "@/components/MaterialButton.vue";
import CustomerSearch from './CustomerSearch.vue';
import { is_allowed } from "@/utils/api_services";

export default {
  name: "CustomerList",
  components: {
    CustomerComponent,
    CardContainer,
    MaterialButton,
    CustomerSearch
  },
  data() {
    return {
      merchant_obj: {}
    }
  },
  methods: {
    is_allowed,
    handleChange() {
      this.$router.push({ path: "/create-customer" });
    },
    search_clicked(merchant_options) {
      this.merchant_obj = merchant_options;
    },
    handleDownload() {
      // Call the download method on the child component using the ref
      this.$refs.customerComponent.downloadData();
    }
  }
};
</script>
