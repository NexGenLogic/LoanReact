<template>
    <div class="d-flex flex-column flex-md-row me-4 gap-2">
      <div style="position: relative; ">
        <input type="text" id="search_text" name="search_text" class="search-text" placeholder="Search" v-model="search_text">
      
    </div>
        <div class="vendor-select-container">

            <select v-model="selected_status" id="merchant_status" class="custom-select-vendor">
                <option  value="">-- All --</option>
                <option  value="active">Active</option>
                <option  value="pending_approval">Pending Approval</option>
                <option  value="paid_off">Paid Off</option>
                <option  value="overdue">Overdue</option>
                <option  value="cancelled">Cancelled</option>
                <option  value="defaulted">Defaulted</option>
                
                
            </select>
        </div>
        <material-button type="button" color="dark"  class="ms-auto mb-0 js-btn-next" @click="searchMerchant">
            <i class="material-icons-round opacity-10 fs-5 me-2">search</i>
        </material-button>
    </div>
</template>
<script>
import MaterialButton from "@/components/MaterialButton.vue";
// import MaterialInput from "@/components/MaterialInput.vue";
export default {
    name: "LoanSearch",
      components:{
        MaterialButton,
        // MaterialInput
      },
    data() {
        return {
            vendors: [],
            selected_status: "",
            search_text : "",
        }
    },
  
    methods: {
        searchMerchant() {
            this.$emit('merchant-search', {"selected_status" : this.selected_status, "search_text" :this.search_text } )
        },
    }
};
</script>
<style scoped>
.vendor-select-container {
    /* background-color: #b2dfdb;  */
    /* padding: 1rem; */
    border-radius: 1rem;
    /* width: 250px; */
}

.custom-select-vendor {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background-color: #ffffff;
    font-size: 1rem;
    color: #333;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='16' height='16' fill='black' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5L8 12l6.5-6.5'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem;
}

.custom-select-vendor:focus {
    outline: none;
    border-color: #004d40;
    box-shadow: 0 0 0 0.2rem rgba(0, 77, 64, 0.25);
}

.search-text {
    /* width: 100%; */
    padding: .6rem; /* left padding for icon space */
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
}

.search-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #888;
    font-size: 18px;
    pointer-events: none; /* so input stays clickable */
}
@media (max-width: 767px) {
    .search-text::placeholder {
        color: transparent;
    }
}

</style>