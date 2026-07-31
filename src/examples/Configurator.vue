<template>
  <div class="fixed-plugin">

    <div class="shadow-sm card">
      <div class="pt-3 pb-0 bg-transparent card-header">
        <div class="float-start" v-if="title">
          <h5 class="mt-3 mb-0">{{ title }}</h5>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <div class="mt-4 float-end" @click="toggle" v-show="closable">
          <button class="p-0 btn btn-link text-dark fixed-plugin-close-button">
            <i class="material-icons">clear</i>
          </button>
        </div>
        <!-- End Toggle Button -->
      </div>
      <hr class="my-1 horizontal dark" v-if="title" />
      <div class="pt-0 card-body pt-sm-3">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState, mapActions } from "vuex";
import { activateDarkMode, deactivateDarkMode } from "@/assets/js/dark-mode";

export default {
  name: "AppConfigurator",
  props: ["toggle", "closable", "title", "subtitle"],
  methods: {
    ...mapMutations(["navbarMinimize", "navbarFixed"]),
    ...mapActions(["setColor"]),

    sidebarColor(color = "success") {
      document.querySelector("#sidenav-main").setAttribute("data-color", color);
      this.setColor(color);
    },

    sidebar(type) {
      this.$store.state.sidebarType = type;
    },

    setNavbarFixed() {
      if (
        this.$route.name !== "Profile" ||
        this.$route.name !== "All Projects"
      ) {
        this.$store.state.isNavFixed = !this.$store.state.isNavFixed;
      }
    },

    darkMode() {
      if (this.$store.state.isDarkMode) {
        this.$store.state.isDarkMode = false;
        deactivateDarkMode();
        return;
      } else {
        this.$store.state.isDarkMode = true;
        activateDarkMode();
      }
    },

    sidenavTypeOnResize() {
  let transparent = document.querySelector("#btn-transparent");
  let white = document.querySelector("#btn-white");

  if (transparent && white) { // ✅ check first
    if (window.innerWidth < 1200) {
      transparent.classList.add("disabled");
      white.classList.add("disabled");
    } else {
      transparent.classList.remove("disabled");
      white.classList.remove("disabled");
    }
  }
}
,
  },
  computed: {
    ...mapState(["isRTL", "sidebarType"]),
    sidenavResponsive() {
      return this.sidenavTypeOnResize;
    },
  },
  beforeMount() {
    this.$store.state.isTransparent = "bg-transparent";
    window.addEventListener("resize", this.sidenavTypeOnResize);
    window.addEventListener("load", this.sidenavTypeOnResize);
  },
};
</script>
