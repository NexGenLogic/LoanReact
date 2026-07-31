<template>
    <div class="container-fluid py-4" :class="`${
      isRTL ? 'rtl' : ''} `">
      <div class="row">
        <div class="col-12">
          <div class="card my-4" style="min-height: 68vh;">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-success  border-radius-lg pt-4 pb-3 d-flex justify-content-between">
                <h6 class="text-white text-capitalize ps-3 ms-4 me-4">{{ title }}</h6> 
                <slot name="header-extra" />
              </div>
             
            </div>
            <div class="card-body px-0 pb-2">
              <div class="table-responsive p-0 ">
                <slot />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapState } from "vuex";
  export default {
    name: "CardContainer",
    props: {
      title: {
        type: String,
        default: "Card Title",
      },
    },
    computed: {
      ...mapState(["isRTL"]),
    },
  };
  </script>
  