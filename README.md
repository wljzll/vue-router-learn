# vue-router-learn
  ## 安装环境
  ```bash
  npm install @vue/cli -g 
  npm install -g @vue/cli-service-global
  ```

  ## vue-router的工作流程：
  `
  1) 用户导入vue-router的入口文件：index.js => import Router from "vue-router";
    (1) 声明了VueRouter类

  2) 通过Vue.use安装使用Router插件 => 这一步是调用Router的install方法；
    (1) install方法全局混入了beforeCreate()生命周期函数；
    (2) 执行beforeCreate生命周期函数时，已经产生router实例了，调用router原型上的init方法 
 
  3) new Router()实例，并将配置的路由表传入 => const router = new Router({});
    (1) 创建路由映射表；
    (2) 根据不同的mode，new 不同的history实例；

  4) 导出router实例，并将router实例在new Vue()时传入；
  
  5) 渲染页面
    (1) 从父级开始，依次创建，并执行每个组件的beforeCreate()方法，执行router的init方法，将_route定义在根实例上，并成为响应式数据；
    (2) 执行init()，先做一次路由跳转，

  `