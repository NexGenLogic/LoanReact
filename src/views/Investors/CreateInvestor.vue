<template>
    <!-- <div class="container-fluid py-4">
        <div class="col-12 col-lg-8 m-auto">
            <div class="card">
                <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2" >
                    <div class="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3">
                        <p class="ms-3 text-white text-center"><b>Create Investor</b></p>
                    </div>
                </div>
                <div class="card-body" :class="[isRTL ? 'rtl' : '']"> -->
                    <CreateInvestorComponent></CreateInvestorComponent>
                <!-- </div>
            </div>
        </div>
    </div> -->
</template>

<script>
import CreateInvestorComponent from "./CreateInvestorComponent.vue"
import {  mapState } from "vuex";

export default {
    name: "CreateInvestor",
    components: {
        CreateInvestorComponent
    },
    computed: {
        ...mapState(["isRTL"])
    }
   
};
</script>
