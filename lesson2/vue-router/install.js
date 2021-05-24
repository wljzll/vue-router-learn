export let _Vue;
export default function install(Vue, options) {
    // 插件安装的入口
    _Vue = Vue; // 这样别的文件都可以使用Vue变量

    // 给所有组件都混入一个属性 router
    Vue.mixin({
        beforeCreate() {
            // 将父亲传入的router实例共享给所有的子组件
            if (this.$options.router) {
                this._routerRoot = this; // 给当前跟组件增加一个属性 _routerRoot 代表的就是自己
                this._router = this.$options.router; // 用户传入的router实例
                this._router.init(this); // 这里的this就是Vue的根实例
            } else {
                // 组件渲染是一层层的渲染
                this._routerRoot = this.$parent && this.$parent._routerRoot;
            }
            // 所有组件上的 _routerRoot属性都是根实例
            // 无论是父组件还是子组件 都可以通过this._routerRoot._router获取共同的
            // Router实例
        }
    })

    // 插件一般用于定义全局组件、全局指令、过滤器、原型方法......
    Vue.component('router-link', {
        render: h => h('a', {}, '')
    })
    Vue.component('router-view', {
        render: h => h('a', {}, '')
    })

    Vue.prototype.$route = {};
    Vue.prototype.$router = {};
}