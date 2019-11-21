import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

// loads the Vue instance and mounts it to the div with id-tag #app

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
