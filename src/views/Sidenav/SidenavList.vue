<template>
  <div class="w-auto h-auto collapse navbar-collapse max-height-vh-100 h-100" id="sidenav-collapse-main">
    <ul class="navbar-nav">
      <template v-if="getUserRole() == 'Customer'">
            <li class="nav-item" v-if="is_allowed('dashboard','read') ">
              <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/customer-dashboard" :navText="$t('message.Dashboard')">
                <template v-slot:icon>
                  <i class="material-icons-round opacity-10 fs-5">dashboard</i>
                </template>
              </sidenav-collapse>
            </li>
      </template>
      <template v-else-if="getUserRole() == 'Investor'">
            <li class="nav-item" v-if="is_allowed('dashboard','read') ">
              <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/investor-dashboard" :navText="$t('message.Dashboard')">
                <template v-slot:icon>
                  <i class="material-icons-round opacity-10 fs-5">dashboard</i>
                </template>
              </sidenav-collapse>
            </li>
      </template>
      <template v-else>
      <li class="nav-item" v-if="is_allowed('dashboard','read') ">
              <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/dashboard" :navText="$t('message.Dashboard')">
                <template v-slot:icon>
                  <i class="material-icons-round opacity-10 fs-5">dashboard</i>
                </template>
              </sidenav-collapse>
            </li>
      </template>
      


        <li class="mt-3 nav-item" v-if="is_allowed('users','read')">
          <h6 class="text-xs ps-4 text-uppercase font-weight-bolder text-white"
            :class="this.$store.state.isRTL ? 'me-4' : 'ms-2'">
            {{ $t('message.Staffs') }}
          </h6>
        </li>

        <li class="nav-item" v-if="is_allowed('users','read')">
          <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/employees"
          :navText="$t('message.Staff')">
            <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">person</i>
            </template>
          </sidenav-collapse>
        </li>
        <li class="mt-3 nav-item" v-if="is_allowed('customers','read')">
          <h6 class="text-xs ps-4 text-uppercase font-weight-bolder text-white"
            :class="this.$store.state.isRTL ? 'me-4' : 'ms-2'">
            Loans
          </h6>
        </li>

        <li class="nav-item" v-if="is_allowed('customers','read')">
          <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/customers"
          navText="Customers">
            <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">person</i>
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item" v-if="is_allowed('loans','read')">
          <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/loans"
          navText="Loans">
            <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">request_quote</i>
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item" v-if="is_allowed('loan_updates','read')">
          <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/update-list"
          navText="Loan Updates">
            <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">request_quote</i>
            </template>
          </sidenav-collapse>
        </li>

         <li class="mt-3 nav-item" v-if="is_allowed('investments','read')">
          <h6 class="text-xs ps-4 text-uppercase font-weight-bolder text-white"
            :class="this.$store.state.isRTL ? 'me-4' : 'ms-2'">
            Investments
          </h6>
        </li>
        <li class="nav-item" v-if="is_allowed('investors','read')">
          <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/investors"
          navText="Investors">
            <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">person</i>
            </template>
          </sidenav-collapse>
        </li>
        <li class="nav-item" v-if="is_allowed('investments','read')">
          <sidenav-collapse url="#" :aria-controls="''" v-bind:collapse="false" collapseRef="/investments"
          navText="Investments">
            <template v-slot:icon>
              <i class="material-icons-round opacity-10 fs-5">savings</i>
            </template>
          </sidenav-collapse>
        </li>
      
    </ul>
    
  </div>
</template>
<script>
import SidenavCollapse from "./SidenavCollapse.vue";
import { logout,is_allowed, isImpersonated, getUserRole } from "@/utils/api_services"; 


export default {
  name: "SidenavList",
  props: {
    cardBg: String
  },
  data() {
    return {
      title: "Soft UI Dashboard PRO",
      controls: "dashboardsExamples",
      isActive: "active",
      
    };
  },
  components: {
    SidenavCollapse
  },
  computed: {

    isAdmin() {
      let admin = localStorage.getItem('admin') || localStorage.getItem('superadmin') ; 
      if(admin == 'true') {
        return true;
      }
      return false;
    },
    userPermissions() {
      const permissions = localStorage.getItem('permissions');
      return permissions ? JSON.parse(permissions) : {};
    }
},
  methods: {
    getUserRole,
    isImpersonated,
    is_allowed,
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    },
    logout() {
      logout();
    },

  }
};
</script>
