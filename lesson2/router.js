import Vue from "vue";
import Router from "./vue-router/index"; // Router是一个插件
import Home from "./views/Home";
import About from "./views/About";

Vue.use(Router);
// 使用这个插件，内部会提供两个全局组件 router-link/router-view
// 并且还会提供两个原型上的属性 $router $route

// 路由：不同的路径，渲染不同的组件
const router = new Router({
  mode: "hash",
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/about",
      component: About,
      children: [
        {
          path: "a", // 这里如果使用了 / 写成 /a 就是指根路径不是子路由了
          component: {
            render: (h) => <h1> about A </h1>,
          },
        },
        {
          path: "b",
          component: {
            render: (h) => <h1> about B </h1>,
          },
        },
      ],
    },
  ],
});

// router.matcher.addRoutes([
//   {
//     path: "/auth",
//     component: {
//       render: (h) => <h1> auth </h1>,
//     },
//   },
// ]);

router.beforeEach((from, to, next) => {
  console.log(1);
  setTimeout(() => {
    next();
  }, 1000);
});
router.beforeEach((from, to, next) => {
  console.log(2);
  setTimeout(() => {
    next();
  }, 1000);
});
export default router;
