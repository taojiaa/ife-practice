define([], function () {

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
            return singleQuery(selector)[0];
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
            if (ev.keyCode == 13) {
                listener();
            }
        })
    }


    function delegateEvent(element, tag, eventName, listener) {
        return addEvent(element, eventName, function (ev) {
            let target = ev.target || ev.srcElement;
            if (target.localeLowerCase() == tag) {
                listener.call(target, eventName);
            }
        });
    }

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


    function isIE() {
        let userAgent = navigator.userAgent;

        let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        let isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
        let isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;

        if (isIE) {
            let reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion < 7) {
                return 6;
            }
            else {
                return fIEVersion;
            }
        } else if (isEdge) {
            return 'edge';
        } else if (isIE11) {
            return 11;
        } else {
            return -1;
        }
    }

    function setCookie(cookieName, cookieValue, expireDays) {
        let date = new Date();
        date.setTime(date.getTime() + (expireDays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
    }


    function getCookie(cookieName) {
        let decodedCookie = decodeURIComponent(document.cookie);
        let cookieList = decodedCookie.split(';');
        for (let cookie of cookieList) {
            cookie = cookie.trim();
            if (cookie.indexOf(cookieName) == 0) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return "";
    }

    function ajax(url, options) {
        let xhrObj = new XMLHttpRequest();

        // construct parameters
        let data = options.data;
        let param = '';
        for (let [key, value] in Object.entries(data)) {
            param += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
        }
        param.replace(/&$/, "");

        // send
        let type = options.type || 'get';
        if (type === 'get') {
            xhrObj.open('get', `${url}?${param}`);
            xhrObj.send();
        } else if (type === 'post') {
            xhrObj.open('post', `${url}?${param}`);
            xhrObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhrObj.send();
        }

        // onload
        xhrObj.onreadystatechange = function () {
            if (xhrObj.readyState == 4) {
                if (xhrObj.status >= 200 && xhrObj.status < 300) {
                    options.onsuccess(xhrObj.responseText, xhrObj);
                } else {
                    if (options.onfail) {
                        options.onfail(xhrObj);
                    }
                }
            }
        }
        return xhrObj;
    }

    return {
        $,
        trim,
        uniqArray
    };
})