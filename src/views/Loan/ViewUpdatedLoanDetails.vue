<template>
    <ViewUpdatedLoanDetailsComponent></ViewUpdatedLoanDetailsComponent>
</template>

<script>
import ViewUpdatedLoanDetailsComponent from "./ViewUpdatedLoanDetailsComponent.vue"
import {  mapState } from "vuex";

export default {
    name: "ViewUpdatedLoanDetails",
    components: {
        ViewUpdatedLoanDetailsComponent
    },
    computed: {
        ...mapState(["isRTL"])
    }
   
};
</script>
