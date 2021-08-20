import createMatcher from "./create-matcher";
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";
import install from "./install";

class VueRouter {
  // new VueRouter时会立即执行constructor
  constructor(options) {
    // 创建匹配器 可用于后续的匹配操作
    // 用户没有传递配置 就默认传入一个空数组
    // 1、match通过路由来匹配组件
    // 2、addRoutes 动态添加匹配规则

    // matcher上保存了两个方法 addRoutes和match
    this.matcher = createMatcher(options.routes || []);

    // 需要根据不同的路径进行切换
    options.mode = options.mode || "hash";
    switch (options.mode) {
      case "hash":
        this.history = new HashHistory(this);
        break;
      case "history":
        this.history = new BrowserHistory(this);
        break;
    }

    // 存放路由导航守卫
    this.beforeHooks = [];
  }
  // beforeCreate时调用init方法
  init(app) { // app vue实例
    // 初始化
    // 监听hash值变化 默认跳转到对应的路径中
    const history = this.history; // 获取history实例

    const setUpHashListener = () => {
      // history原型上的setupListener方法 绑定hashchange 监听hash值变化
      history.setupListener();
    };

    // 初始化 会先获得当前的hash值进行跳转 并且监听hash变化
    history.transitionTo(
      history.getCurrentLocation(), // 获取路径中的hash值
      setUpHashListener
    );

    /**
     * 每次路径变化都会调用此方法 _route变化会触发视图更新
     * listen base公共父类原型上的listen方法
     * beforeCreate调用init时，渲染watcher还保存在Dep.target上
     */
    history.listen((route) => {
      // 更新_route
      app._route = route;
    });
  }
  push(to) {
    this.history.push(to);
  }
  go() {}
  match(location) {
    return this.matcher.match(location);
  }
  beforeEach(fn) {
    this.beforeHooks.push(fn);
  }
}
VueRouter.install = install;
// 默认vue-router插件导出一个类，用户会new Router()
export default VueRouter;

/**
 * VueRouter的执行流程:
 * 
 * 1) 用户 new Router() 传入配置项:
 * 
 *    1.1) 先执行Router类的constructor函数,这个函数里做了一些初始化的操作:
 *      - 执行createMatcher()函数,将用户配置的路由表扁平化处理,并暴露两个方法 addRoutes()和match(), 并将这两个方法暴漏在router实例的matcher属性上;
 *      - addRoutes() 用来向扁平化后的路由表中添加新的路由(新的路由如果是父子路由也会被扁平化);
 *      - match() 返回 {path: '/', matched: [{component: '', parent: '', path: ''}]} 格式的结果;
 * 
 *    1.2) 根据用户传入的不同的mode, 创建对应的history实例,并将当前router实例传入;
 * 
 *    1.3) new HashHistory(this):
 *      - hashHistory是继承了baseHistory,先去执行hashHistory的constructor()函数:
 *        => 调用super(router)将路由实例传入并继承父类 => 将路由实例保存到history实例的router属性上 this.router = router;
 *        => 调用ensureSlash()方法,将当前路径变成路由模式,确保是路由模式
 *      
 *      - hashHistroy原型上添加三个方法:
 *      - getCurrentLocation(): 获取当前的hash
 *      - push(): 调用继承自History的transitionTo()方法跳转路由
 *      - setupListener(): 添加hashchange事件
 * 
 *   1.4) hashHistory中执行super(router)时,执行父类的constructor(router):
 *      - 将当前router实例保存到History实例上: this.router = router
 *      - 创建一个根hash匹配: this.current = createRoute(null, {path: '/'}): {path: '/', matched: []}
 *      - 原型上添加三个方法:
 *      - listen(): 调用base History原型上的listen()方法,将更新vue._route属性的函数保存到cb属性上
 *      - transitionTo(location, onComplete)[从3.1步骤走过来]: 
 *        - 从扁平化的路由表中获取当前路径的信息: let route = this.router.match(location)
 *        - 判断重复跳转
 *        - 获取before的路由钩子
 *        - 定义runQueue()函数
 *        - 定义iterator()函数
 *        - 执行runQueue()函数
 *      - updateRoute():
 * 
 * 2) Vue.use(Router)调用Router的install方法:
 *   2.1) 全局混入beforeCreate()钩子函数,钩子函数中的逻辑:
 *      - 在vue根实例上添加_routerRoot指向这个vue根实例自己:this._routerRoot = this
 *      - 将router实例保存到根实例的_router属性上: this._router = this.$options.router
 *      - 调用router实例的init()方法,并将vue实例传入: this._router.init(this)
 *      - 在vue上定义一个响应式数据_route,并且将history的current属性也定义成和vue的data一样的响应式数据: Vue.util.defineReactive(this, '_route', this._router.history.current)
 *      - 如果是vue的子组件,通过向父级查找的方式,将根实例保存在自己的_routerRoot属性上,这个每个组件都能拿到router实例: this._routerRoot = this.$parent && this.$parent._routerRoot
 * 
 *  2.2) 注册全局组件: router-link/router-view
 *      - Vue.component('router-link', routerLink)
 *      - Vue.component('router-view', routerView)
 * 
 *  2.3) 在Vue原型上定义两个属性:
 *      - Object.defineProperty(Vue.prototype, '$route', {
 *            get() {
 *                return this._routerRoot._route; // path matched
 *            }
 *        })
 *      
 *      - Object.defineProperty(Vue.prototype, '$router', {
 *          get() {
 *              return this._routerRoot._router; // push go replace
 *          }
 *       })
 *
 * 3) 执行router原型上的init()方法:
 *  3.1) 获取history()实例: const history = this.history
 *  3.2) 调用history原型上的transitionTo()方法:
 *  3.3) 调用history原型上的listen()方法:
 */ 
