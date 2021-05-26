# vue-router-learn
  ## 安装环境
  ```bash
  npm install @vue/cli -g 
  npm install -g @vue/cli-service-global
  ```

  ## vue-router的工作流程：
  `
  1) 用户导入vue-router的入口文件：index.js => import Router from "vue-router";
    (1) index.js中

  2) 通过Vue.use安装使用Router插件 => 这一步是调用Router的install方法；
     

  3) new Router()实例，并将配置的路由表传入 => const router = new Router({});


  4) 导出router实例，并将router实例在new Vue()时传入；


  `