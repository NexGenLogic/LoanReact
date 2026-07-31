import { createStore } from "vuex";
// import { auth } from "./auth.module";
import { profile } from "./profile.module";
import {main_category} from "./main_category.module";

export default createStore({
  modules: {
    // auth,
    profile,
    main_category
  },
  state: {
    selectedLanguage: 'en',
    hideConfigButton: false,
    isPinned: false,
    showOffCanvas: false,
    sidebarType: "bg-gradient-dark",
    isRTL: false,
    color: "info",
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    isDarkMode: true,
    navbarFixed:
      "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
    absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
  },
  mutations: {
    toggleOffCanvasMenu(state) {
      state.showOffCanvas = !state.showOffCanvas;
    },
    setLanguage(state, lang) {
      state.selectedLanguage = lang
    },
    setIsRTL(state, value) {
      state.isRTL = value
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");

      if (sidenav_show.classList.contains("g-sidenav-pinned")) {
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = false;
      }
    },
    navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    toggleEveryDisplay(state) {
      state.showNavbar = !state.showNavbar;
      state.showSidenav = !state.showSidenav;
      // state.showFooter = !state.showFooter;
    },
    hideFooter(state) {
      state.showFooter = false;
    },
    toggleHideConfig(state) {
      state.hideConfigButton = !state.hideConfigButton;
    },
    color(state, payload) {
      state.color = payload;
    },
  },
  actions: {
    setColor({ commit }, payload) {
      commit("color", payload);
    },
    changeLanguage({ commit }, lang) {
      commit('setLanguage', lang)
      const rtlLanguages = ['ar', 'ur']
      commit('setIsRTL', rtlLanguages.includes(lang))
    }
  },
  getters: {
    currentLanguage: state => state.selectedLanguage,
    isRTL: state => state.isRTL
  },
});
