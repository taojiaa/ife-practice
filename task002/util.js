function isArray(arr) {
    return Object.prototype.toString.call(arr) == '[object Array]';
}

function isFunction(fn) {
    return Object.prototype.toString.call(fn) == '[object Function]';
}

function isObject(obj) {
    return typeof obj == 'object' && obj != null;
}

function cloneObject(src, hash = new WeakMap()) {
    if (!isObject(src)) return src;
    if (hash.has(src)) return hash.get(src);
    let tgt = isArray(src) ? [] : {};
    hash.set(src, tgt);
    Reflect.ownKeys(src).forEach(key => {
        if (isObject(src[key])) {
            tgt[key] = cloneObject(src[key], hash);
        } else {
            tgt[key] = src[key];
        }
    })
    return tgt;
}

function uniqArray(arr) {
    let newArr = [];
    let set = new Set();
    for (let val of arr) {
        if (!set.has(val)) {
            newArr.push(val);
            set.add(val);
        }
    }
    return newArr;
}
