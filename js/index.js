/* jshint browser: true, esnext: true, devel: true, shadow: true */

var output = {};

(function () {

    window.Pool.Load("data", function (data) {

        for (var t in data) {
            var tt = t.toLowerCase().replace(" ", "_");
            output[tt] = [];
            for (var i = 0; i < data[t].length; i++) {
                output[tt][i] = {};
                output[tt][i].name = data[t][i].Name;
                output[tt][i].latitude = parseFloat(data[t][i].Latitude);
                output[tt][i].Longitude = parseFloat(data[t][i].Longitude);
                output[tt][i].cluster_3 = parseInt(data[t][i].Cluster_3, 10);
                output[tt][i].cluster_5 = parseInt(data[t][i].Cluster_5, 10);
                output[tt][i].cluster_7 = parseInt(data[t][i].Cluster_7, 10);
                output[tt][i].x = parseFloat(data[t][i].X);
                output[tt][i].y = parseFloat(data[t][i].Y);
            }
        }

        function fixedEncodeURIComponent(str) {
            return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
                return '%' + c.charCodeAt(0).toString(16);
            });
        }

        var href = "text/json;charset=utf-8," + fixedEncodeURIComponent(JSON.stringify(output));
        document.querySelector("body > main").innerHTML = "<a href='data: " + href + "' download='data.json'></a>";
        document.querySelector("body > main > a").dispatchEvent(new Event("click"));

    });

}());