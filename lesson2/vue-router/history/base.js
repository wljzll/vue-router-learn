/**
 * 将当前跳转的路由的父路由和自己都添加到matched中，从外向内渲染
 * @param {Object} record 扁平化后的pathMap对应的路由信息
 * @param {Object} location 当前的路径
 * @returns  {path: '/', matched: [{component: '', parent: '', path: ''}]}
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
    // 保存router实例到History实例上
    this.router = router;

    // 创建history时，路径中的路由默认是 /  this.current = {path: '/', matched: []}
    this.current = createRoute(null, {
      path: "/",
    });

  }
  // 保存传入的更新 app._route的方法 当hash变化后 再次执行cb 触发Vue页面更新
  listen(cb) {
    // 将cb保存到实例上
    this.cb = cb;
  }
  /**
   *
   * @param {*} location 当前要跳转的路径 刷新页面时就是页面上的路由, 两个来源:
   *           1) init()方法中调用时是hashHistory原型上的getCurrentLocation()方法的执行结果,也就是获取的url地址栏中的hash值;
   *           2) 用户调用push方法时,就是用户传入的路径
   * @param {*} onComplete 添加hashchange事件的函数，只会执行一次 或者push方法中的改变hash值的回调函数,两个来源:
   *           1) init()方法中调用时是一个函数,函数中调用history.setupListener()方法,绑定hashchange事件,只会执行一次;
   *           2) 用户调用push()方法时也是一个包装函数,函数中执行 window.location.hash = location; 然后会触发hashchange事件
   * @returns
   */
  transitionTo(location, onComplete) {
    // 跳转时都会调用此方法 from to......
    // 路径变化了 视图还要刷新  响应式数据
    let route = this.router.match(location); // 当前最新的匹配到的结果
    // 防止重复跳转
    debugger
    if (
      location == this.current.path &&
      route.matched.length == this.current.matched.length
    ) {
      return;
    }

    // beforeEach钩子函数函数参数组成的数组
    let queue = [].concat(this.router.beforeHooks);

    /**
     * 
     * @param {Array} queue beforeHooks组成的声明周期钩子数组
     * @param {*} iterator 迭代器
     * @param {*} cb 回调函数 回调函数执行:1)执行updateRoute()函数,修改current,触发页面更新;2)执行onComplete,改变url的hash,实现url的改变
     */
    function runQueue(queue, iterator, cb) {
      function step(index) {
        // 所有钩子执行完成，执行cb，更新页面
        if (index >= queue.length) return cb();
        // 拿到beforeHooks中对应的函数
        let hook = queue[index];
        // 交给iterator执行
        iterator(hook, () => step(index + 1));
      }
      // 默认执行第一个queue
      step(0);
    }
    
    /**
     * 
     * @param {*} hook 路由钩子
     * @param {*} next 包装函数,函数中执行step(index + 1) 也就是用户调用的next函数,用户执行
     */
    const iterator = (hook, next) => {
      hook(this.current, route, () => {
        next();
      });
    };

    // queue: beforeEach钩子函数函数参数组成的数组
    runQueue(queue, iterator, () => {
      this.updateRoute(route);
      // 绑定hashchange或pushstate事件监听
      onComplete && onComplete();
    });
  }
  updateRoute(route) {
    // 更新current,触发页面更新 current已经被定义成响应式的了,收集渲染watcher
    this.current = route; // 每次路由切换都会更改current属性
    // 这个方法调用就是更新 vue实例上的_route属性
    this.cb && this.cb(route);
    // 视图重新渲染有几个要求：
    // 1、模板中要用
    // 2、current得是响应式的
  }
}

export {
  History
};