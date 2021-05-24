import createMatcher from "./crate-matcher";
import install from "./install";

class VueRouter {
    constructor(options) {
        // 创建匹配其 可用于后续的匹配操作
        // 用户没有传递配置 就默认传入一个空数组
        // 1、match通过路由来匹配组件
        // 2、addRoutes 动态添加匹配规则
        this.matcher = createMatcher(options.routes || []);
    }
    init(app) {

    }
}
VueRouter.install = install;
// 默认vue-router插件导出一个类，用户会new Router()
export default VueRouter;