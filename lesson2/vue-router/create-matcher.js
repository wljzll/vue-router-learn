import createRouteMap from "./create-route-map";
import { createRoute } from "./history/base";

/**
 * @description 
 * @param {Array} routes 用户配置的路由表
 * @returns
 */
export default function createMatcher(routes) {
  //   {
  //     "/": {
  //       path: "/",
  //       component: {
  //         staticRenderFns: [],
  //         _compiled: true,
  //         beforeCreate: [null],
  //         beforeDestroy: [null],
  //         __file: "views/Home.vue",
  //       },
  //     },
  //     "/about": {
  //       path: "/about",
  //       component: {
  //         staticRenderFns: [],
  //         _compiled: true,
  //         beforeCreate: [null],
  //         beforeDestroy: [null],
  //         __file: "views/About.vue",
  //       },
  //     },
  //     "/about/a": {
  //       path: "/about/a",
  //       component: {},
  //       parent: {
  //         path: "/about",
  //         component: {
  //           staticRenderFns: [],
  //           _compiled: true,
  //           beforeCreate: [null],
  //           beforeDestroy: [null],
  //           __file: "views/About.vue",
  //         },
  //       },
  //     },
  //     "/about/b": {
  //       path: "/about/b",
  //       component: {},
  //       parent: {
  //         path: "/about",
  //         component: {
  //           staticRenderFns: [],
  //           _compiled: true,
  //           beforeCreate: [null],
  //           beforeDestroy: [null],
  //           __file: "views/About.vue",
  //         },
  //       },
  //     },
  //   }
  // pathMap = {'/': Home, '/about': About, '/about/a': AboutA}
  let { pathMap } = createRouteMap(routes); // 扁平化配置

  /**
   * 在原有路由表扁平化后的基础上添加新的路由
   * @param {*} routes 用户需要新加入的路由
   */
  function addRoutes(routes) {
    createRouteMap(routes, pathMap);
  }

  /**
   * 根据要跳转的路径，获取路由信息，把父路由一起组成matched对象，matched中的路由都是要渲染的 才能渲染到最终的路由上
   * @param {String} location 当前跳转的路径
   * @returns 根据当前路径匹配到
   */
  function match(location) {
    // 可能一个路径有多层记录因为需要包含父元素
    let record = pathMap[location]; 

    if (record) {
      return createRoute(record, {
        path: location,
      });
    }

    // 如果不存在这个路径,则创建这个record
    return createRoute(null, {
      path: location,
    });
  }

  return {
    addRoutes, // 添加路由的方法
    match, // 返回匹配路径信息的方法
  };
}
