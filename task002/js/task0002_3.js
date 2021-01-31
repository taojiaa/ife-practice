define(["util"], function (util) {
    let pic = util.$('#pic');
    let picStyle = window.getComputedStyle(pic);
    let imgStyle = window.getComputedStyle(pic.firstElementChild);

    let imgWidth = parseInt(imgStyle.width.replace('px', ''))
    let picNum = pic.childElementCount - 1;
    let totalWidth = picNum * imgWidth;

    let frame = 20, move = imgWidth / frame, interval = 10;

    let animate = function (interval, start, end, move) {
        let intID = setInterval(function () {
            start += move;
            pic.style.left = start + 'px';
            if (start == end) {
                clearInterval(intID);
            }
        }, interval, start, end, move)
    }

    util.$.click('#arrow-left', function () {
        let oldLeft = parseInt(picStyle.left.replace('px', ''))
        if (oldLeft == 0) {
            pic.style.left = '-' + totalWidth + 'px';
            oldLeft = -totalWidth;
        }
        let newLeft = oldLeft + imgWidth;

        animate(interval, oldLeft, newLeft, move);
    })

    util.$.click('#arrow-right', function () {
        let oldLeft = parseInt(picStyle.left.replace('px', ''))
        if (oldLeft == -totalWidth) {
            pic.style.left = '0px';
            oldLeft = 0;
        }
        let newLeft = oldLeft - imgWidth;

        animate(interval, oldLeft, newLeft, -move);

    })

    util.$.delegate('#button-container', 'span', 'click', function () {
        let number = this.id.slice(-1);
        let newLeft = - imgWidth * (number - 1);

        let oldLeft = parseInt(picStyle.left.replace('px', ''))

        let signMove = newLeft < oldLeft ? -move : move;

        if (newLeft != oldLeft) {
            animate(interval, oldLeft, newLeft, signMove);
        }
    })
})