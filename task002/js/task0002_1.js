define(['util'], function (util) {
    util.$.click("#p1-button", function () {
        let hobbies = util.$("#p1-input").value;
        let hobbiesArr = hobbies.split(',');
        hobbiesArr = hobbiesArr.filter(item => util.trim(item));

        let processedHobbies = util.uniqArray(hobbiesArr);
        util.$("#p1-output").value = processedHobbies;
    });

    util.$.click("#p2-button", function () {
        let hobbies = util.$("#p2-input").value;
        let hobbiesArr = hobbies.split(/[\s | \u3000 | , | \uff0c | \u3001 | ; | u000B]+/g);
        hobbiesArr = hobbiesArr.filter(item => util.trim(item));

        let processedHobbies = util.uniqArray(hobbiesArr);
        util.$("#p2-output").value = processedHobbies;
    });


    util.$.click("#p3-button", function () {
        let hobbies = util.$("#p3-input").value;
        let hobbiesArr = hobbies.split(/[\s | \u3000 | , | \uff0c | \u3001 | ; | u000B]+/g);
        hobbiesArr = hobbiesArr.filter(item => util.trim(item));
        if (hobbiesArr.length == 0 || hobbiesArr.length > 10) {
            alert("The number of your hobbies typed in must not be more than 10 or less than 1!")
        } else {
            let processedHobbies = util.uniqArray(hobbiesArr);
            let output = util.$("#p3-output");
            output.innerText = "";
            for (let hobby of processedHobbies) {
                let p = document.createElement('p');
                let input = document.createElement('input');
                let label = document.createElement('label');

                p.className = "p3-checkbox";

                input.className = "p3-checkbox-input";
                input.type = 'checkbox';
                input.value = hobby;
                input.id = hobby;

                label.className = "p3-checkbox-label";
                label.for = hobby;
                label.innerText = hobby;

                p.appendChild(input);
                p.appendChild(label);
                output.appendChild(p);
            }
        }
    });
})
