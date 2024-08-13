import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/router';

import { globalCookiesConfig } from "vue3-cookies";

import "./assets/css/reset.css";
import "./assets/css/common.css";

import "./assets/css/tui-grid.css";
import "./assets/css/tui-grid-datepicker.css";
import "./assets/css/tui-grid-timepicker.css";
import "./assets/css/tui-grid-editor.css";

const app = createApp(App);
const pinia = createPinia();

globalCookiesConfig({
  expireTimes: "30d",
  path: "/",
  domain: "",
  secure: true,
  sameSite: "None",
});

// console.log(import.meta.env);
app.use(router);
app.use(pinia);
app.mount('#app');
