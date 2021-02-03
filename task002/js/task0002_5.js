define(['util'], function (util) {
    const str2Int = str => parseInt(str.replace('px', ''));

    let itemWidth, itemHeight, barHeight, allBarNum;
    itemWidth = getComputedStyle(document.documentElement).getPropertyValue('--item-width');
    itemWidth = str2Int(itemWidth);
    itemHeight = getComputedStyle(document.documentElement).getPropertyValue('--item-height');
    itemHeight = str2Int(itemHeight);

    barHeight = getComputedStyle(document.documentElement).getPropertyValue('--bar-height');
    barHeight = str2Int(barHeight);
    allBarNum = barHeight / itemHeight;

    // init items
    let bars = [util.$('#bar-1'), util.$('#bar-2')];
    let barNums = [6, 4];
    let barPos = bars.map(bar => bar.getBoundingClientRect());
    let holes = { 0: [], 1: [] };

    for (let i = 0; i < bars.length; i++) {
        let fragment = document.createDocumentFragment();
        for (let j = 0; j < allBarNum; j++) {
            if (j < barNums[i]) {
                let item = document.createElement('div');
                item.classList.add('item');
                item.setAttribute('col', i);
                item.style['position'] = 'positive';
                item.style['left'] = 0;
                item.style['top'] = j * itemHeight;
                fragment.appendChild(item);
            } else {
                holes[i].push([barPos[i].left, j * itemHeight + barPos[i].top]);
            }
            bars[i].appendChild(fragment);
        }
    }

    // add motion
    let moveEle;
    let dragging;
    let tLeft, tTop;
    let startLeft, startTop;
    let moveX, moveY;
    let col, targetCol;
    let shift = 20;

    document.addEventListener('mousedown', function (e) {
        if (e.target.classList.contains('item')) {
            moveEle = e.target;
            dragging = true;

            startLeft = moveEle.style['left'];
            startTop = moveEle.style['top'];

            col = parseInt(moveEle.getAttribute('col'));

            let moveEleRect = moveEle.getBoundingClientRect();
            tLeft = e.clientX - moveEleRect.left;
            tTop = e.clientY - moveEleRect.top;
        }
    });

    document.addEventListener('mouseup', function (e) {
        if (moveEle) {
            dragging = false;
            moveEle.style['opacity'] = 1;

            targetCol = +!col;

            for (let i = 0; i < holes[targetCol].length; i++) {
                let [left, top] = holes[targetCol][i];
                let withinX = moveX > left - shift && moveX < left + shift;
                let withinY = moveY > top - shift && moveY < top + shift;
                if (withinX && withinY) {
                    // add and remove ele from holes
                    holes[targetCol].splice(i);
                    holes[col].push([str2Int(startLeft) + barPos[col].left, str2Int(startTop) + barPos[col].top]);

                    // rearange the item in DOM
                    moveEle.remove();
                    bars[targetCol].appendChild(moveEle);
                    moveEle.setAttribute('col', targetCol);

                    // put the item in the right place
                    moveEle.style['left'] = left - barPos[targetCol].left + 'px';
                    moveEle.style['top'] = top - barPos[targetCol].top + 'px';
                    break;
                } else {
                    moveEle.style['left'] = startLeft;
                    moveEle.style['top'] = startTop;
                }
            }
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (dragging) {
            moveX = e.clientX - tLeft;
            moveY = e.clientY - tTop;

            moveEle.style['left'] = moveX - barPos[col].left + 'px';
            moveEle.style['top'] = moveY - barPos[col].top + 'px';
            moveEle.style['opacity'] = 0.5;
        }
    }
    )
})