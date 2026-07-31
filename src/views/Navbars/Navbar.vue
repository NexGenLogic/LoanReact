<template>
  <nav class="shadow-none navbar navbar-main navbar-expand-lg border-radius-xl" v-bind="$attrs" id="navbarBlur"
    data-scroll="true" :class="isAbsolute ? 'mt-4' : 'mt-0'">
    <div class="px-3 py-1 container-fluid">
      <BreadCrumbs :currentPage="currentRouteName" :color="color" />
      <div class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4" :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar">
        <div class="pe-md-3 d-flex align-items-center" :class="isRTL ? 'me-md-auto' : 'ms-md-auto'">
        </div>
        <ReturnToAdmin v-if="isImpersonating"></ReturnToAdmin>
        <ul class="navbar-nav justify-content-end">

          <!-- Use the new NotificationBell component -->
          <NotificationBell v-if="isAuthenticated" :user="loggedInUser" :color="color" />

          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-flex align-items-center py-0" href="#" role="button"
              data-bs-toggle="dropdown" aria-expanded="false" :class="color ? color : 'text-body'">
              <i class="material-icons" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'">account_circle</i>
              <span class="top-right-username">Hello,  {{ loggedInUser.name }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li class="nav-item d-flex align-items-center">
                <router-link :to="{ name: 'User Profile' }"
                  class="px-0 nav-link font-weight-bold lh-1 d-flex align-items-center">
                  <i class="material-icons ms-2" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'">
                    account_circle
                  </i>
                  {{ $t('message.myprofile') }}
                </router-link>
              </li>
              <hr class="m-0">
              <li class="nav-item d-flex align-items-center">
                <router-link :to="{ name: 'merchant.login' }" @click="logout"
                  class="px-0 nav-link font-weight-bold lh-1 d-flex align-items-center">
                  <i class="material-icons ms-2" :class="isRTL ? 'ms-sm-2' : 'me-sm-1'">
                    logout
                  </i>
                  Logout
                </router-link>
              </li>
            </ul>
          </li>
          <li class="nav-item d-xl-none ps-3 d-flex align-items-center">
            <a href="#" @click="toggleSidebar" class="p-0 nav-link text-body lh-1" id="iconNavbarSidenav">
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import BreadCrumbs from "../Breadcrumbs.vue";
import { mapMutations, mapState } from "vuex";
import { logout, isAdmin } from "@/utils/api_services";
import ReturnToAdmin from "../ReturnToAdmin.vue";
import NotificationBell from "../components/NotificationBell.vue";  // Import the new component

export default {
  name: "AppNavBar",
  props: ["minNav", "color"],
  components: {
    BreadCrumbs,
    ReturnToAdmin,
    NotificationBell, // Register the new component
  },
  methods: {
    ...mapMutations(["navbarMinimize"]),
    actingAsAdmin() {
      return isAdmin();
    },
    toggleSidebar() {
      this.navbarMinimize();
    },
    logout() {
      logout();
    },
  },
  computed: {
    ...mapState(["isRTL", "isAbsolute"]),
    currentRouteName() {
      return this.$route.name;
    },
    isAuthenticated() {
      return !!localStorage.getItem('access_token');
    },
    isImpersonating() {
      return !!localStorage.getItem('impersonator_token');
    },
    loggedInUser() {
      return JSON.parse(localStorage.getItem('user') || '{}');
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

.top-right-username {
  font-family: 'Pacifico', cursive;
  color: #2c3e50;
}
</style>
