export let _Vue;
import routerLink from './components/link'
import routerView from './components/view'
export default function install(Vue, options) {
    // 插件安装的入口
    _Vue = Vue; // 这样别的文件都可以使用Vue变量

    // 给所有组件都混入一个属性 router
    Vue.mixin({
        beforeCreate() {
            // 将父亲传入的router实例共享给所有的子组件
            if (this.$options.router) { // 根实例
                this._routerRoot = this; // 给当前根实例增加一个属性 _routerRoot 代表的就是自己
                this._router = this.$options.router; // 将router实例保存到根实例的_router属性上
                this._router.init(this); // 调用router实例的init方法 这里的this就是Vue的根实例

                // 如何获取到current属性 将current属性定义在_route上
                // 当current变化后 更新_route属性
                // 如果current中的path或者matched的其他属性变化 也是响应式的
                Vue.util.defineReactive(this, '_route', this._router.history.current);
            } else { // 子组件
                // 组件渲染是一层层的渲染
                this._routerRoot = this.$parent && this.$parent._routerRoot;
            }
            // 所有组件上的 _routerRoot属性都是根实例
            // 无论是父组件还是子组件 都可以通过this._routerRoot._router获取共同的
            // Router实例
        }
    })

    // 插件一般用于定义全局组件、全局指令、过滤器、原型方法......
    Vue.component('router-link', routerLink)
    Vue.component('router-view', routerView)
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route; // path matched
        }
    })
    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            return this._routerRoot._router; // push go replace
        }
    })
}