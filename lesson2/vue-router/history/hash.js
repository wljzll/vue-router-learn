import { History } from "./base";

function ensureSlash() {
    if (window.location.hash) { // location.hash是有兼容性问题
        return;
    }
    window.location.hash = '/'
}

function getHash() {
    return window.location.hash.slice(1);
}

class HashHistory extends History {
    constructor(router) {
        super(router);
        this.router = router;

        // 确保hash模式下 有一个 / 路径
        ensureSlash();
    }
    getCurrentLocation() {
        return getHash();
    }
    setupListener() {
        window.addEventListener('hashchange', () => {
            // 当hash变化了 再次拿到hash值进行跳转
            this.transitionTo(getHash()); // hash变化，再次进行跳转
        })
    }
}

export default HashHistory;