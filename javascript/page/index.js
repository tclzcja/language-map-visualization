var Data;
var HT_ID_Object;

$(document).ready(
    function () {

        Pool.Load("data", function (data) {

            Data = JSON.parse(JSON.stringify(data));

            for (var t in Data) {
                for (var i = 0; i < Data[t].length; i++) {
                    Data[t][i].ID = i;
                    Data[t][i].Latitude = parseFloat(Data[t][i].Latitude);
                    Data[t][i].Longitude = parseFloat(Data[t][i].Longitude);
                    Data[t][i].Cluster_3 = parseInt(Data[t][i].Cluster_3);
                    Data[t][i].Cluster_5 = parseInt(Data[t][i].Cluster_5);
                    Data[t][i].Cluster_7 = parseInt(Data[t][i].Cluster_7);
                    Data[t][i].X = parseFloat(Data[t][i].X);
                    Data[t][i].Y = parseFloat(Data[t][i].Y);
                }
            }

            Render();

            $("#select-type, #select-cluster").on("change", Render);

        });

    }
)

function Render() {

    $("#language").html("");
    $("#map-container").html("");

    var Selection_Type = $("#select-type").val();

    var Min_X = 999.0;
    var Max_X = -100;
    var Min_Y = 999;
    var Max_Y = -100;

    var T_Base = $("#language").height() / 2;

    for (var i = 0; i < Data[Selection_Type].length; i++) {
        Min_X = Min_X > Data[Selection_Type][i].X ? Data[Selection_Type][i].X : Min_X;
        Max_X = Max_X < Data[Selection_Type][i].X ? Data[Selection_Type][i].X : Max_X;
        Min_Y = Min_Y > Data[Selection_Type][i].Y ? Data[Selection_Type][i].Y : Min_Y;
        Max_Y = Max_Y < Data[Selection_Type][i].Y ? Data[Selection_Type][i].Y : Max_Y;
    }

    $("#ruler-x > section:nth-child(1)").html(Min_X.toFixed(2));
    $("#ruler-x > section:nth-child(3)").html(Max_X.toFixed(2));

    $("#ruler-y > section:nth-child(1)").html(Min_Y.toFixed(2));
    $("#ruler-y > section:nth-child(3)").html(Max_Y.toFixed(2));

    $("#ruler-y").width($("#chart").height());

    for (var i = 0; i < Data[Selection_Type].length; i++) {
        var D = document.createElement("div");
        //var S = document.createElement("span");
        //$(S).html(data[Selection_Type][i].Name).attr("Data-id", data[Selection_Type][i].ID).attr("Data-lexicon", data[Selection_Type][i].Lexicon);
        $(D).attr("data-x", Data[Selection_Type][i].X).attr("data-y", Data[Selection_Type][i].Y).attr("data-id", Data[Selection_Type][i].ID);
        $(D).attr("data-longitude", Data[Selection_Type][i].Longitude).attr("data-latitude", Data[Selection_Type][i].Latitude);
        //var R = Math.floor(((data[Selection_Type][i].Weight - Min_Weight) / (Max_Weight - Min_Weight) + 1) * R_Base);
        var R = 10;
        $(D).css("left", (Data[Selection_Type][i].X - Min_X) / (Max_X - Min_X) * 100 + "%");
        $(D).css("top", (Data[Selection_Type][i].Y - Min_Y) / (Max_Y - Min_Y) * 100 + "%");
        //$(D).css("height", R * 2).css("width", R * 2).css("border-radius", R).css("line-height", R * 2 + "px");
        //$(D).css("top", T_Base - R);

        switch ($("#select-cluster").val()) {
            case "3": {
                $(D).attr("data-cluster", Data[Selection_Type][i].Cluster_3);
                break;
            }
            case "5": {
                $(D).attr("data-cluster", Data[Selection_Type][i].Cluster_5);
                break;
            }
            case "7": {
                $(D).attr("data-cluster", Data[Selection_Type][i].Cluster_7);
                break;
            }
        }

        $(D).appendTo("#language");
        //$(S).css("top", $(D).position().top + R - 10).css("left", $(D).position().left).css("width", R * 2).css("margin-left", 0 - R);
        //$(S).appendTo("#language");
    }

    function Collapsing(a, b) {
        var CorXa = $(a).position().left + $(a).width() / 2;
        var CorYa = $(a).position().top + $(a).height() / 2;
        var CorXb = $(b).position().left + $(b).width() / 2;
        var CorYb = $(b).position().top + $(b).height() / 2;
        return Math.floor(Math.sqrt(Math.pow(CorXa - CorXb, 2) + Math.pow(CorYa - CorYb, 2))) <= 80;
        //$(a).height() / 2 + $(b).height() / 2
    }

    $("#language > div").on("mouseover", function () {
        Informatic($(this).attr("data-id"), $(this).attr("data-cluster"));
    }).on("mouseleave", function () {
        Go_Off($(this).attr("data-id"));
    })

    $("#language > div").css("opacity", 1);

    var map = new Datamap({
        element: document.getElementById('map-container'),
        fills: {
            defaultFill: '#333', //any hex, color name or rgb/rgba value
            '0': 'rgba(90, 144, 255, 0.5)',
            '1': 'rgba(255, 90, 90, 0.5)',
            '2': 'rgba(90, 218, 48, 0.5)',
            '3': 'rgba(255, 218, 48, 0.5)',
            '4': 'rgba(90, 90, 255, 0.5)',
        },
        geographyConfig: {
            borderWidth: 1,
            borderColor: '#111',
            popupOnHover: false,
            highlightOnHover: false,
        },
    });

    // Bubbling starts
    var bubble = [];

    for (var i = 0; i < Data[Selection_Type].length; i++) {
        bubble.push({
            id: i,
            latitude: Data[Selection_Type][i].Latitude,
            longitude: Data[Selection_Type][i].Longitude,
            radius: 5,
            name: Data[Selection_Type][i].Name,
            fillKey: Data[Selection_Type][i]["Cluster_" + $("#select-cluster").val()],
        })
    }

    map.bubbles(bubble, {
        borderWidth: 0,
        popupOnHover: false,
    });

    $("#map-container svg circle").on("mouseenter", function () {
        Informatic(JSON.parse($(this).attr("data-info")).id, JSON.parse($(this).attr("data-info")).fillKey);
    }).on("mouseleave", function () {
        Go_Off(JSON.parse($(this).attr("data-info")).id, JSON.parse($(this).attr("data-info")).fillKey);
    })

    $("#ruler-y").css("opacity", 1);
    $("#ruler-x").css("opacity", 1);
}

function Informatic(i, c) {
    var Selection_Type = $("#select-type").val();
    var index = parseInt(i);
    $("#info-name").html(Data[Selection_Type][index].Name);
    $("#info-longitude-latitude").html("<span>Longitude</span> " + Data[Selection_Type][index].Longitude.toFixed(2) + " <span>Latitude</span> " + Data[Selection_Type][index].Latitude.toFixed(2));
    switch ($("#select-cluster").val()) {
        case "3": {
            $("#info-cluster").html("<span>Cluster</span> " + Data[Selection_Type][index].Cluster_3);
            break;
        }
        case "5": {
            $("#info-cluster").html("<span>Cluster</span> " + Data[Selection_Type][index].Cluster_5);
            break;
        }
        case "7": {
            $("#info-cluster").html("<span>Cluster</span> " + Data[Selection_Type][index].Cluster_7);
            break;
        }
    }
    $("#chart > #language > div.highlight").removeClass("highlight")
    $("#chart > #language > div[data-id='" + i + "']").addClass("highlight");
    $("#chart > #language > div[data-cluster!=" + c + "]").addClass("fade-off");

    $("#map svg circle.highlight").attr("class", "datamaps-bubble");
    var s = "\"id\":" + index + ",";
    var cs = "\"fillKey\":" + c;
    $("#map svg circle:not([data-info*='" + cs + "'])").attr("class", "datamaps-bubble fade-off");
    $("#map svg circle[data-info*='" + s + "']").attr("class", "datamaps-bubble highlight");
}

function Go_Off(i) {
    $("#chart > #language > div.highlight").removeClass("highlight");
    $("#map svg circle.highlight").attr("class", "datamaps-bubble");
    $("#chart > #language > div.fade-off").removeClass("fade-off");
    $("#map svg circle.fade-off").attr("class", "datamaps-bubble");
}