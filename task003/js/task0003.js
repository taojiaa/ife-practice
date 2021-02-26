define(["utils", "elements", "operations"], function (util, ele, ops) {
    function main() {
        util.readTextFile("./data/data.json", function (text) {
            let data = JSON.parse(text)
            ops.bindAllEvents(data);
        })
    }

    main();
})