define(['util'], function (util) {
    let database = ['a', 'ab', 'abc', 'boy', 'cc', 'da', 'de'];

    let inputId = 'search-bar';
    let ulId = 'search-list';

    let input = util.$(`#${inputId}`);
    let ul = util.$(`#${ulId}`);

    let removeBorder = function () {
        input.style['border-bottom-left-radius'] = 0;
        input.style['border-bottom-right-radius'] = 0;
    }

    let recoverBorder = function () {
        ul.innerHTML = "";
        input.style['border-bottom-left-radius'] = '20px';
        input.style['border-bottom-right-radius'] = '20px';
    }

    util.$.on(`#${inputId}`, "input", function (e) {
        let input = e.target;
        let updatedValue = input.value;
        let ul = util.$(`#${ulId}`);

        if (updatedValue == "") {
            ul.innerHTML = "";
            recoverBorder();
            return;
        }

        let autoFillArr = [];
        for (let value of database) {
            if (value.indexOf(updatedValue) != -1) {
                autoFillArr.push(value);
            }
        }

        let fragment = document.createDocumentFragment();
        for (let value of autoFillArr) {
            let li = document.createElement('li');
            li.className = "item";
            li.setAttribute('tabindex', '0');
            li.textContent = value;
            fragment.appendChild(li);
        }

        if (autoFillArr.length > 0) {
            fragment.firstElementChild.classList.add("first-item");
            fragment.lastElementChild.classList.add("last-item");
            removeBorder();
        } else {
            recoverBorder();
        }
        ul.innerHTML = "";
        ul.appendChild(fragment);
    })

    window.addEventListener('keydown', function (e) {
        let input = util.$(`#${inputId}`);
        let inputContent = input.value;
        let ul = util.$(`#${ulId}`);
        if (ul.childElementCount == 0) {
            return;
        }

        let isPrintableKey = e.key.length === 1;
        if (isPrintableKey) {
            input.focus();
        }

        let ele = e.target;
        let nextEle;

        if (e.key == 'ArrowDown') {
            if (ele.id == inputId) {
                nextEle = ele.nextElementSibling.firstElementChild
            } else if (!ele.classList.contains('last-item')) {
                nextEle = ele.nextElementSibling;
            }
        }

        if (e.key == 'ArrowUp') {
            if (ele.classList.contains('first-item')) {
                nextEle = ele.parentNode.previousElementSibling;
            } else if (ele.id != inputId) {
                nextEle = ele.previousElementSibling;
            }
        }

        if (nextEle) {
            nextEle.focus();
            input.value = nextEle.id == inputId ? inputContent : nextEle.textContent;
        }

        if (e.key == 'Enter') {
            recoverBorder();
            input.focus();
        }
    })

    util.$.delegate(`#${ulId}`, 'li', 'click', function (e) {
        recoverBorder();
        input.focus();
    })

})