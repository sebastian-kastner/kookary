import { createApp } from "vue";
import { createVfm } from 'vue-final-modal'

import App from "./App.vue";
import router from "./router";
import { addIcons } from "./icons";
import { rootStore, userStore, initStores } from "./stores/rootStore";
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

const app = createApp(App);

const vfm = createVfm();

app.use(rootStore);
app.use(vfm);
app.use(router);
app.use(ToastPlugin, { position: "bottom", type: "error", duration: 10000 });

initStores();
addIcons();

userStore.initUserLogin().finally(() => {
  app.mount("#app");
});

// import { createApp } from "vue";
// import router from "./router";
// import { rootStore, userStore, initStores } from "./stores/rootStore";
// import ToastPlugin from "vue-toast-notification";
// import "vue-toast-notification/dist/theme-bootstrap.css";

// // Vue.config.productionTip = false

// const app = createApp(App).use(router);
// app.use(rootStore);
// app.use(router);
// app.use(ToastPlugin, { position: "bottom", type: "error", duration: 10000 });
// // Vue.use(VModal, { dialog: true });

// initStores();

// userStore.initUserLogin().finally(() => {
//   app.mount("#app");
// });
