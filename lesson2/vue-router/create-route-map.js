export default function createRouteMap(routes, oldPathMap) {
    let pathMap = oldPathMap || Object.create(null); // 默认没有传递就是直接创建映射表，只有通过addRoutes方法添加路由时，才会存在oldPathMap

    routes.forEach(route => {
        addRouteReacord(route, pathMap);
    })

    return {
        pathMap
    }
}

// 先序深度遍历
function addRouteReacord(route, pathMap, parent) { // parent就是父亲
    let path = parent ? parent.path + '/' + route.path : route.path;
    let record = {
        path,
        component: route.component,
        parent // 这个属性用来标识当前组件的父亲是谁
    }
    if (!pathMap[path]) { // 不能重复添加路由
        pathMap[path] = record;
    }
    if (route.children) {
        route.children.forEach(childRoute => {
            // 在遍历儿子时，将父亲的记录传进去
            addRouteReacord(childRoute, pathMap, record);
        })
    }
}