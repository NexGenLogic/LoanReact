<template>
    <div class="page-header min-vh-100 d-flex flex-column justify-content-center align-items-center" :style="backgroundStyle">
      <img :src="errorImage" alt="404 Error" class="img-fluid" style="max-width: 500px;" />
      <h2 class="text-white mt-4">Oops! Page not found</h2>
      <router-link to="/" class="btn btn-success mt-3">Go to Home</router-link>
    </div>
  </template>
  
  <script> 
  import { mapMutations } from "vuex";
  import errorImage from "@/assets/img/404.png"; // replace with your actual image path

  
  
  export default {
    name: "NotFound",
    data() {
      return {
        errorImage,
        backgroundStyle: {
          backgroundSize: "cover",
          backgroundPosition: "center",
        },
      };
    },
    beforeMount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
    },
    beforeUnmount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
    },
    methods : {
        ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    }
  };
  </script>
  
  <style scoped>
  .page-header {
    text-align: center;
  }
  </style>
  