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

function simpleTrim(str) {
    for (var start = 0; start < str.length; start++) {
        if (str[start] != ' ') break;
    }
    for (var end = str.length - 1; end > 0; end--) {
        if (str[end] != ' ') break;
    }
    return str.substring(start, end + 1);
}


function trim(str) {
    return str.replace(/(^\s*) | (\s*$)/g, '');
}


function each(arr, fn) {
    for (let [index, item] of Object.entries(arr)) {
        fn(item, index);
    }
}

function getObjectLength(obj) {
    let count = 0;
    for (let key in obj) {
        count += 1;
    }
    return count;
}

function isEmail(emailStr) {
    var pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return pattern.test(emailStr);
}

function isMobilePhone(phone) {
    let pattern = /^1[3456789]d{9}$/;
    return pattern.test(phone);
}
