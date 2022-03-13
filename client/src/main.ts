import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { rootStore, initStores } from './stores/rootStore'

Vue.config.productionTip = false

initStores().then(() => {
  new Vue({
    router,
    store: rootStore,
    render: h => h(App)
  }).$mount('#app')
});

