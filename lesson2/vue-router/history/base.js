
/**
 * 将当前跳转的路由的父路由和自己都添加到matched中，从外向内渲染
 * @param {Object} record 扁平化后的pathMap对应的路由信息
 * @param {Object} location 当前的路径
 * @returns 
 */
export function createRoute(record, location) {
  let res = []; // ['/about', '/about/a']
  // 如果record也就是对应的路由信息存在
  if (record) {
    while (record) {
      res.unshift(record); // 将父路由放到res的第一个
      record = record.parent; // 父路由
    }
  }
  return {
    ...location,
    matched: res,
  };
}

class History {
  constructor(router) {
    // 获取router实例
    this.router = router;
    /**
     * 创建history时，路径中的路由默认是 / 
     */
    this.current = createRoute(null, {
      path: "/",
    });
    // this.current = {path: '/', matched: []}
    // console.log(this.current);
  }
  listen(cb) {
    // 将cb保存到实例上
    this.cb = cb;
  }
  /**
   *
   * @param {*} location 当前要跳转的路径 刷新页面时就是页面上的路由
   * @param {*} onComplete 添加hashchange事件的函数，只会执行一次 或者push方法中的改变hash值的回调函数
   * @returns
   */
  transitionTo(location, onComplete) {
    // 跳转时都会调用此方法 from to......
    // 路径变化了 视图还要刷新  响应式数据
    let route = this.router.match(location); // 当前最新的匹配到的结果
    // 防止重复跳转
    if (
      location == this.current.path &&
      route.matched.length == this.current.matched.length
    ) {
      return;
    }

    // beforeEach钩子函数函数参数组成的数组
    let queue = [].concat(this.router.beforeHooks);
    
    function runQueue(queue, iterator, cb) {
      function step(index) {
        // 所有钩子执行完成，执行cb，更新页面
        if (index >= queue.length) return cb();
        // 拿到beforeHooks中对应的函数
        let hook = queue[index];
        // 交给iterator执行
        iterator(hook, () => step(index + 1));
      }
      step(0);
    }

    const iterator = (hook, next) => {
      hook(this.current, route, () => {
        next();
      });
    };
    /**
     * queue: beforeEach钩子函数函数参数组成的数组
     */
    runQueue(queue, iterator, () => {
      this.updateRoute(route);
      // 根据路径加载不同的组件
      onComplete && onComplete();
    });
  }
  updateRoute(route) {
    this.current = route; // 每次路由切换都会更改current属性
    this.cb && this.cb(route);
    // 视图重新渲染有几个要求：
    // 1、模板中要用
    // 2、current得是响应式的
  }
}

export { History };
