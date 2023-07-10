import { createApp } from "vue";
import { createVfm } from 'vue-final-modal'

import App from "./App.vue";
import router from "./router";
import { addIcons } from "./icons";
import { rootStore, userStore, initStores } from "./stores/rootStore";
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';


const vfm = createVfm();

userStore.initUserLogin().finally(() => {
  const app = createApp(App);
  app.use(rootStore);
  app.use(vfm);
  app.use(router);
  app.use(ToastPlugin, { position: "bottom", type: "error", duration: 10000 });
  app.mount("#app");
});

initStores();
addIcons();

