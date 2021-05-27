export function createRoute(record, location) {
  let res = []; // ['/about', '/about/a']
  if (record) {
    while (record) {
      res.unshift(record);
      record = record.parent;
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
    // 当我们创建完路由后，先有一个默认值：路径和匹配到的记录做成一个映射表
    // 默认 当创建history时 路径应该是 / 这时候时没有匹配记录的
    this.current = createRoute(null, {
      path: "/",
    });
    // this.current = {path: '/', matched: []}
    console.log(this.current);
  }
  listen(cb) {
    // 将cb保存到实例上
    this.cb = cb;
  }
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
      console.log(route, "route");
      // 根据路径加载不同的组件
      // console.log(location);
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
