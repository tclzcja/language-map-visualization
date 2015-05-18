var Pool = (function () {

    var _body = {};

    _body.Load = function (name, callback) {

        var XHR2 = new XMLHttpRequest();

        XHR2.open("GET", "../data/" + name + ".xlsx", true);
        XHR2.responseType = "arraybuffer";

        XHR2.onload = function (e) {
            var data = new Uint8Array(XHR2.response);
            var result = new Array();

            for (var i = 0; i < data.length; i++) {
                result[i] = String.fromCharCode(data[i]);
            }

            var workbook = XLSX.read(result.join(""), { type: "binary" });

            var final = {};
            workbook.SheetNames.forEach(function (sheetName) {
                var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                final[sheetName] = roa;
            })

            callback(final);

        }

        XHR2.send();

    }

    return _body;

}());