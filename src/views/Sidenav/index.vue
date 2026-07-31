<template>
  <aside id="sidenav-main" class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 ms-3"
    :class="`${isRTL ? 'me-3 rotate-caret fixed-end' : 'fixed-start ms-3'
      } ${sidebarType}`">
    <div class="sidenav-header">
      <i class="top-0 p-3 cursor-pointer fas fa-times text-secondary opacity-5 position-absolute end-0 d-none d-xl-none"
        aria-hidden="true" id="iconSidenav"></i>
      <a class="m-0 navbar-brand" href="/" style="margin-left: 25px !important;">
        <img :src="sidebarType === 'bg-white' ||
            (sidebarType === 'bg-transparent' && !isDarkMode)
            ? logoDark
            : logo
          " class="navbar-brand-img h-100" alt="main_logo" />
        <!-- <span class="ms-2 font-weight-bold text-white"
          >SPT</span
        > -->
      </a>
    </div>
    <hr class="horizontal light mt-0 mb-2" />
    <sidenav-list />
     <!-- <div class="sidenav-footer mt-auto">
    <div class="text-sm text-center copyright text-muted"
      :class="this.$store.state.isRTL ? 'text-lg-end' : 'text-lg-start'">
      ©
      <a href="https://cyberforttech.com/" class="font-weight-bold" target="_blank">Cyber Fort Technologies</a>
</div>
    </div> -->
  </aside>

</template>
<script>
import SidenavList from "./SidenavList.vue";
import logo from "@/assets/img/loan_app_logo_cropped.png";
import logoDark from "@/assets/img/logo-ct-dark.png";
import { mapState } from "vuex";

export default {
  name: "AppIndex",
  components: {
    SidenavList,
  },
  data() {
    return {
      logo,
      logoDark,
    };
  },
  computed: {
    ...mapState(["isRTL", "sidebarType", "isDarkMode"]),
  },
};
</script>

<style scoped>
/* Ensure the main sidebar container is the positioning context */


/* Position the footer at the bottom */
.sidenav-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem; /* Adjust padding as needed for spacing */
  background-color: inherit; /* Ensures it matches the sidebar background */
}
</style>

