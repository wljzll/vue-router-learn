import Vue from 'vue';
import router from './router'
import App from './App.vue'

const vm = new Vue({
        el: '#app',
        name: 'main',
        router,
        render: (h) => {
            return h(App)
        },

    })
    console.log(vm);