import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { rootStore, userStore, initStores } from "./stores/rootStore";

const app = createApp(App);
app.use(rootStore);
app.use(router);
// for some reason this breaks the access to this.$router
// app.use(ToastPlugin, { position: "bottom", type: "error", duration: 10000 });

initStores();

userStore.initUserLogin().finally(() => {
  app.mount("#app");
});

// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// import { rootStore, userStore, initStores } from "./stores/rootStore";
// // import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
// // import VModal from 'vue-js-modal'
// import ToastPlugin from "vue-toast-notification";
// import "vue-toast-notification/dist/theme-bootstrap.css";

// // Vue.config.productionTip = false

// const app = createApp(App).use(router);
// app.use(rootStore);
// app.use(router);
// // app.use(BootstrapVue);
// // app.use(BootstrapVueIcons);
// app.use(ToastPlugin, { position: "bottom", type: "error", duration: 10000 });
// // Vue.use(VModal, { dialog: true });

// initStores();

// userStore.initUserLogin().finally(() => {
//   app.mount("#app");
// });
