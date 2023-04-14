import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { rootStore, initStores } from './stores/rootStore'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VModal, { dialog: true });
Vue.use(ToastPlugin, { position: 'bottom', type: 'error', duration: 10000 });

initStores().then(() => {
  new Vue({
    router,
    store: rootStore,
    render: h => h(App)
  }).$mount('#app')
});

