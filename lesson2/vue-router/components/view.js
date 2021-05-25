export default {
    name: 'routerView',
    functional: true,
    render(h, { parent, data }) {
        let route = parent.$route;
        let depth = 0;
        data.routerView = true;
        while (parent) { // parent router-view的父标签
            // $vnode 代表的是组件占位符的虚拟DOM
            // _vnode 代表的是组件占位符内部真实内容的虚拟节点
            if (parent.$vnode && parent.$vnode.data.routerView) {
                depth++;
            }
            parent = parent.$parent;
        }
        let record = route.matched[depth];
        if (!record) {
            return h();
        }
        return h(record.component, data);
    }
}