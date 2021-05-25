import { History } from "./base";

// 在路径中添加 / 确保路径是hash
function ensureSlash() {
    if (window.location.hash) { // location.hash是有兼容性问题
        return;
    }
    window.location.hash = '/'
}

// 获取当前路径中的hash值
function getHash() {
    return window.location.hash.slice(1);
}

class HashHistory extends History {
    constructor(router) {
        super(router);
        // 保存router实例
        this.router = router;

        // 确保hash模式下 有一个 / 路径
        ensureSlash();
    }
    getCurrentLocation() {
        return getHash();
    }
    push(location) {
        this.transitionTo(location, () => {
            window.location.hash = location;
        })
    }
    setupListener() {
        window.addEventListener('hashchange', () => {
            // 当hash变化了 再次拿到hash值进行跳转
            this.transitionTo(getHash()); // hash变化，再次进行跳转
        })
    }
}

export default HashHistory;