<template>
  <div class="watermark-container">
    <img :src="watermarkLogo" alt="Watermark" />
  </div>
  
  <sidenav
    :custom_class="color"
    :class="[isRTL ? 'fixed-end' : 'fixed-start']"
    v-if="!isAuthPage" 
  />
  <main
    class="main-content position-relative max-height-vh-100 h-100 overflow-x-hidden"
    :class="[isRTL ? 'rtl' : '']"
  >
    <!-- nav -->
    <navbar
      :class="[isNavFixed ? navbarFixed : '', isAbsolute ? absolute : '', isRTL ? 'rtl' : '']"
      :color="isAbsolute ? 'text-white opacity-8' : ''"
      :minNav="navbarMinimize"
      v-if="!isAuthPage" 
    />
    <router-view />
    <app-footer v-show="!isAuthPage" />
  </main>
</template>

<script>
import Sidenav from "./views/Sidenav";
import Navbar from "@/views/Navbars/Navbar.vue";
import AppFooter from "@/examples/Footer.vue";
import { mapMutations, mapState } from "vuex";
import watermarkLogo from "@/assets/img/watermark.png";

export default {
  name: "App",
  components: {
    Sidenav,
    Navbar,
    AppFooter
  },
  data() {
    return {
      watermarkLogo
    };
  },
  methods: {
    ...mapMutations(["navbarMinimize"])
  },
  computed: {
    ...mapState([
      "isRTL",
      "color",
      "isAbsolute",
      "isNavFixed",
      "navbarFixed",
      "absolute",
      "showOffCanvas",
      "hideConfigButton"
    ]),
    isAuthPage() {
      // List of all route names that should NOT have the main layout
      const authRoutes = [
        'SignIn', 
        'admin.login', 
        'merchant.login', 
        'Register', 
        'Signup', 
        'Password Forgot', 
        'Password Reset'
      ];
      // Check if the current route's name is in our list of auth-related pages
      return authRoutes.includes(this.$route.name);
    }
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";
    const sidenav = document.getElementsByClassName("g-sidenav-show")[0];
    if (window.innerWidth > 1200) {
      sidenav.classList.add("g-sidenav-pinned");
    }
  }
};
</script>

<style>
:root {
  --input-pixi-border-color: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
}
</style>

<style scoped>
.watermark-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  opacity: 0.08;
  pointer-events: none;
  user-select: none;
}

.watermark-container img {
  max-width: 200px;
  height: auto;
}
</style>
