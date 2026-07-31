<template>
    <div class="terms-container">
      <h1>Terms and Conditions</h1>
      <p>
        Welcome to our application. Please read the terms and conditions carefully before using our services.
      </p>
  
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using this application, you accept and agree to be bound by the terms and provisions of this agreement.
      </p>
  
      <h2>2. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. You should check this page regularly.
      </p>
  
      <h2>3. Use of the Service</h2>
      <p>
        You agree not to misuse the services provided and to comply with all applicable laws.
      </p>
  
      <h2>4. Limitation of Liability</h2>
      <p>
        We are not liable for any damages or losses resulting from your use of the service.
      </p>
  
      <h2>5. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us.
      </p>
      <div class="px-1 pt-0 text-center card-footer px-lg-2">
                                        <p class="mx-auto mb-4 text-sm">
                                           Go back to Sign up
                                            <router-link :to="{ name: 'Signup' }"
                                                class="text-success text-gradient font-weight-bold">Sign Up</router-link>
                                        </p>
                                    </div>
    </div>
    
  </template>
  
  <script>
  import { mapMutations } from "vuex";
  export default {
    name: "TermsAndConditions",
    beforeMount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
    },
    beforeUnmount() {
        this.toggleEveryDisplay();
        this.toggleHideConfig();
    },
    methods: {
        ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    }
  };
  </script>
  
  <style scoped>
  .terms-container {
    background-color: white;
    padding: 2rem;
    max-width: 800px;
    margin: 2rem auto;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    color: #333;
    font-family: Arial, sans-serif;
  }
  
  h1 {
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  h2 {
    margin-top: 1.5rem;
    font-size: 1.25rem;
  }
  
  p {
    line-height: 1.6;
  }
  </style>
  