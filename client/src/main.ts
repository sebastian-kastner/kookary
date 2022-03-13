import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { rootStore, initStores } from './stores/rootStore'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

initStores().then(() => {
  new Vue({
    router,
    store: rootStore,
    render: h => h(App)
  }).$mount('#app')
});

