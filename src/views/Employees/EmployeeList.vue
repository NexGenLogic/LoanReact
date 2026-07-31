<template>
    <CardContainer title="Employees">
      <template #header-extra>
        <div class="d-flex align-items-center me-4 gap-3 flex-column flex-lg-row">
          <EmployeeSearch @merchant-search="search_clicked"/>
          <material-button
            type="button"
            color="dark"
            class="d-flex ms-4 mb-0 js-btn-next me-4"
            @click="handleChange"
          >
            <i class="material-icons-round opacity-10 fs-5 me-2">add_circle</i>
            <span class="d-none d-lg-block ms-4 ">Create New Employee</span>
          </material-button>
        </div>
      
    </template>
      <employee-component :search_obj="merchant_obj"/>
    </CardContainer>
    
  </template>
  
  <script>
  import EmployeeComponent  from './EmployeeComponent.vue';
  import CardContainer  from '../components/CardContainer.vue';
  // import CardContainer  from '../components/CardContainer.vue';
  import MaterialButton from "@/components/MaterialButton.vue";
  import EmployeeSearch from './EmployeeSearch.vue';
  export default {
    name: "EmployeeList",
    components:{
      EmployeeComponent,
      CardContainer,
      MaterialButton,
      EmployeeSearch
    },
    data(){
      return {
        merchant_obj : {}
      }
    },
    methods: {
      handleChange() {
        this.$router.push({ path: "/create-employee" });
      },
      search_clicked(merchant_options) {
        this.merchant_obj = merchant_options;
      }
    }
  };
  </script>
  