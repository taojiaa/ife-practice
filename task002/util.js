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

function addClass(element, newClassName) {
    if (!element.classList.contains(newClassName)) {
        element.classList.add(newClassName);
    }
}

function removeClass(element, oldClassName) {
    if (element.classList.contains(newClassName)) {
        element.classList.remove(newClassName);
    }
}

function isSiblingNode(element, siblingNode) {
    return element.parentNode === siblingNode.parentNode;
}

function getPosition(element) {
    return {
        x: element.getBoundingClientRect().left,
        y: element.getBoundingClientRect().top
    };
}


// 实现一个简单的Query
function $(selector) {

}

// 可以通过id获取DOM对象，通过#标示，例如
$("#adom"); // 返回id为adom的DOM对象

// 可以通过tagName获取DOM对象，例如
$("a"); // 返回第一个<a>对象

// 可以通过样式名称获取DOM对象，例如
$(".classa"); // 返回第一个样式定义包含classa的对象

// 可以通过attribute匹配获取DOM对象，例如
$("[data-log]"); // 返回第一个包含属性data-log的对象

$("[data-time=2015]"); // 返回第一个包含属性data-time且值为2015的对象

// 可以通过简单的组合提高查询便利性，例如
$("#adom .classa"); // 返回id为adom的DOM所包含的所有子节点中，第一个样式定义包含classa的对象

function singleQuery(selector, root) {
    let elements = [];
    root = root || document;
    switch (selector.charAt(0)) {
        case '#':
            elements.push(root.getElementById(selector.substring(1)));
            break;
        case '.':
            elements.push(root.getElementByClassName(selector.substring(1)));
            break;
        case '[':
            if (selector.indexOf('=') == -1) {
                let allChildNodes = root.getElementByTagName('*');
                for (let value of allChildNodes) {
                    if (value.getAttribute(selector.substring(1, -1)) != null) {
                        elements.push(value);
                    }
                }
            } else {
                let index = selector.indexOf('=');
                let allChildNodes = root.getElementByTagName('*');
                for (let value of allChildNodes) {
                    if (value.getAttribute(selector.substring(1, index)) == selector.substring(index + 1, -1)) {
                        elements.push(value);
                    }
                }
            }
            break;
        default:
            elements.push(root.getElementByTagName);
    }
    return elements;
}

function $(selector) {
    selector = selector.trim()
    if (selector.indexOf(" ") == -1) {
        return singleQuery(selector);
    } else {
        let selectorArr = selector.split(/\s+/);
        return singleQuery(selectorArr[1], singleQuery(selector[0])[0])[0];
    }
}

function addEvent(element, event, listener) {
    if (element.addEventListener) {
        element.addEventListener(event, listener);
    } else if (element.attachEvent) {
        element.attachEvent(event, listener);
    } else {
        element["on" + event] = listener;
    }
}


function removeEvent(element, event, listener) {
    if (element.removeEventListener) {
        element.removeEventListener(event, listener);
    } else if (element.detachEvent) {
        element.detachEvent(event, listener);
    } else {
        element["on" + event] = null;
    }
}

// 实现对click事件的绑定
function addClickEvent(element, listener) {
    addEvent(element, "click", listener);
}

// 实现对于按Enter键时的事件绑定
function addEnterEvent(element, listener) {
    addEvent(element, "keydown", function (ev) {
        let ev = ev || window.event;
        if (ev.keyCode == 13) {
            listener();
        }
    })
}
$.on = addEvent;
$.un = removeEvent;
$.click = addClickEvent;
$.enter = addEnterEvent;


function delegateEvent(element, tag, eventName, listener) {
    return addEvent(element, eventName, function (ev) {
        let ev = ev || window.event;
        let target = ev.target || ev.srcElement;
        if (target.localeLowerCase() == tag) {
            listener.call(target, eventName);
        }
    });
}

$.delegate = delegateEvent;


$.on = function (selector, event, listener) {
    return addEvent($(selector), event, listener);
};

$.click = function (selector, listener) {
    return addClickEvent($(selector), listener);
};

$.un = function (selector, event, listener) {
    return removeEvent($(selector), event, listener);
};

$.delegate = function (selector, tag, eventName, listener) {
    return delegateEvent($(selector), tag, eventName, listener);
};