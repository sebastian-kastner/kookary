import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { rootStore, userStore, initStores } from "./stores/rootStore";
// import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
// import VModal from 'vue-js-modal'
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";

// Vue.config.productionTip = false

// Vue.use(BootstrapVue);
// Vue.use(BootstrapVueIcons);

// createApp(App); --> this does not work for some reason..
const app = createApp({});
app.use(rootStore);
app.use(router);
// app.use(BootstrapVue);
// app.use(BootstrapVueIcons);
app.use(ToastPlugin, { position: "bottom", type: "error", duration: 10000 });
// Vue.use(VModal, { dialog: true });

initStores();

userStore.initUserLogin().finally(() => {
  app.mount("#app");
});
