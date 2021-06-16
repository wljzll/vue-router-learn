import Vue from 'vue';

const vm = new Vue({
    el: '#app',
    render: (h) => {
    return h('h1', {}, 'hello')
    }
})
// console.log(vm);