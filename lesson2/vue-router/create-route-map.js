/**
 * 返回的是一个扁平化后的路由对象
 * @param {Array} routes 用户配置的路由表
 * @param {Object | null } oldPathMap 拍平后的路由表
 * @returns {} 
 */
export default function createRouteMap(routes, oldPathMap) {
    let pathMap = oldPathMap || Object.create(null); // 默认没有传递就是直接创建映射表，只有通过addRoutes方法添加路由时，才会存在oldPathMap
    
    // 遍历路由表 拍平处理
    routes.forEach(route => {
        addRouteRecord(route, pathMap);
    })

    return {
        pathMap
    }
}

/**
 * 先序深度遍历
 * @description 将传入的路由拍平天啊及到路由映射表[pathMap]中
 * @param {*} route 每一个路由
 * @param {*} pathMap 拍平后的路由表对象
 * @param {*} parent 当前路由的父路由
 */
function addRouteRecord(route, pathMap, parent) { // parent就是父亲
    // 如果有父路由将父路由拼接上
    let path = parent ? parent.path + '/' + route.path : route.path;
    // 组件record对象
    let record = {
        path,
        component: route.component,
        parent // 这个属性用来标识当前组件的父亲是谁
    }

    // 不能重复添加路由
    if (!pathMap[path]) { 
        pathMap[path] = record;
    }
    
    // 有儿子 遍历儿子 递归处理
    if (route.children) {
        route.children.forEach(childRoute => {
            // 在遍历儿子时，将父亲的记录传进去
            addRouteRecord(childRoute, pathMap, record);
        })
    }
}