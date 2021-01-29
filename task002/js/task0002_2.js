define(["util"], function (util) {
    util.$.click('#button', function () {
        let targetDate = new Date(util.$('#input').value);
        let output = util.$('#output');

        const getDuration = function (time) {
            var days = time / 1000 / 60 / 60 / 24;
            var daysRound = Math.floor(days);
            var hours = time / 1000 / 60 / 60 - (24 * daysRound);
            var hoursRound = Math.floor(hours);
            var minutes = time / 1000 / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
            var minutesRound = Math.floor(minutes);
            var seconds = time / 1000 - (24 * 60 * 60 * daysRound) - (60 * 60 * hoursRound) - (60 * minutesRound);
            var secondsRound = Math.floor(seconds);
            return `${daysRound} days ${minutesRound} minutes ${secondsRound} seconds left`;
        }
        let intervalID = setInterval(function () {
            let timeDiff = targetDate - Date.now();
            output.value = getDuration(timeDiff);
        }, 1000, targetDate, output, getDuration)
    })
})