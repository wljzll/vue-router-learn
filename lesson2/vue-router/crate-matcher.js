import createRouteMap from "./create-route-map";

export default function createMatcher(routes) {
    // pathMap = {'/': Home, '/about': About, '/about/a': AboutA}

    let { pathMap } = createRouteMap(routes); // 扁平化配置

    function addRoutes(routes) {
        createRouteMap(routes, pathMap)
    }

    console.log(pathMap);

    function match() {

    }

    return {
        addRoutes, // 添加路由
        match // 匹配路径
    }
}