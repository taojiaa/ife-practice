define([], function () {
    function loadTree(parent, callback) {
        for (let i = 0; i < parent.children.length; i++) {
            var child = parent.children[i];
            callback(child);
            loadTree(child, callback);
        }
    }

    function insertAfter(newEl, targetEl) {
        var parentEl = targetEl.parentNode;

        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        } else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    }

    function getTodayString() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = `${yyyy}-${mm}-${dd}`;
        return today
    }

    function filterObjectByValue(obj, fn) {
        let newObj = {}
        for (let [key, value] of Object.entries(obj)) {
            if (fn(value)) {
                newObj[key] = value;
            }
        }
        return newObj;
    }

    function delegateEvent(element, event, filter, listener) {
        return element.addEventListener(event, function (ev) {
            let target = ev.target || ev.srcElement;
            if (filter(target)) {
                listener.call(target, event);
            }
        });
    }

    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    return {
        loadTree,
        insertAfter,
        getTodayString,
        filterObjectByValue,
        delegateEvent,
        readTextFile
    }
})