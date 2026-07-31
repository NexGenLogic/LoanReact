import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import MaterialDashboard from "./material-dashboard";
import { setToken } from '../src/utils/api_services';
import i18n from './i18n'; 
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// --- START: LARAVEL ECHO SETUP ---
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
// Retrieve the auth token from local storage
const token = localStorage.getItem('access_token');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.VUE_APP_PUSHER_APP_KEY, // Correct for Vue CLI
    cluster: process.env.VUE_APP_PUSHER_APP_CLUSTER, // Correct for Vue CLI
    forceTLS: true,
    auth: {
        headers: {
            Authorization: `Bearer ${token}`
        },
    },
});
// --- END: LARAVEL ECHO SETUP ---

if (token) {
  setToken(token); 
}

const savedLang = localStorage.getItem('language') || 'en'
store.commit('setLanguage', savedLang)
store.commit('setIsRTL', ['ar', 'ur'].includes(savedLang))
i18n.global.locale = savedLang
document.documentElement.setAttribute('dir', ['ar', 'ur'].includes(savedLang) ? 'rtl' : 'ltr')

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(i18n);
appInstance.use(MaterialDashboard);
appInstance.mount("#app");

if (['ar', 'ur'].includes(savedLang)) {
  document.getElementById('app').classList.add('rtl');
}
