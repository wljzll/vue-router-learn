import createMatcher from "./crate-matcher";
import HashHistory from "./history/hash";
import BrowserHistory from "./history/history";
import install from "./install";

class VueRouter {
    constructor(options) {
        // 创建匹配其 可用于后续的匹配操作
        // 用户没有传递配置 就默认传入一个空数组
        // 1、match通过路由来匹配组件
        // 2、addRoutes 动态添加匹配规则
        this.matcher = createMatcher(options.routes || []);

        // 需要根据不同的路径进行切换
        options.mode = options.mode || 'hash';
        switch (options.mode) {
            case 'hash':
                this.history = new HashHistory(this);
                break;
            case 'history':
                this.history = new BrowserHistory(this);
                break;
        }
    }
    init(app) { // 初始化
        // 监听hash值变化 默认跳转到对应的路径中
        const history = this.history;

        const setUpHashListener = () => {
            history.setupListener(); // 监听路由变化 hashchange
        }

        // 初始化 会先获得当前的hash值进行跳转 并且监听hash变化
        history.transitionTo(
            history.getCurrentLocation(), // 获取当前位置
            setUpHashListener
        )

        // 每次路径变化都会调用此方法 _route变化会触发视图更新
        history.listen((route) => {
            app._route = route;
        })
    }
    push(to) {
        this.history.push(to)
    }
    go() {

    }
    match(location) {
        return this.matcher.match(location);
    }
}
VueRouter.install = install;
// 默认vue-router插件导出一个类，用户会new Router()
export default VueRouter;