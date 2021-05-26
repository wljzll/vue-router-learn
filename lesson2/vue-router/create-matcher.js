import createRouteMap from "./create-route-map";
import { createRoute } from './history/base'
export default function createMatcher(routes) {
    // pathMap = {'/': Home, '/about': About, '/about/a': AboutA}

    let { pathMap } = createRouteMap(routes); // 扁平化配置

    function addRoutes(routes) {
        createRouteMap(routes, pathMap)
    }

    // console.log(pathMap);

    function match(location) {
        let record = pathMap[location]; // 可能一个路径有多个记录
        // 如果不存在这个路径,则创建这个record
        if (record) {
            return createRoute(record, {
                path: location
            })
        }

        return createRoute(null, {
            path: location
        })
    }

    return {
        addRoutes, // 添加路由
        match // 匹配路径
    }
}