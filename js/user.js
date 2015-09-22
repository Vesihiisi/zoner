$(document).ready(function() {



    var color1 = "#ffffcc";
    var color2 = "#ffeda0";
    var color3 = "#fed976";
    var color4 = "#feb24c";
    var color5 = "#fd8d3c";
    var color6 = "#fc4e2a";
    var color7 = "#e31a1c";
    var color8 = "#bd0026";
    var color9 = "#800026";



    function parseDate(str_date) {
        return new Date(Date.parse(str_date));
    }

    function minutesToIcon(minutes) {
        if (minutes < 2) {
            return icon9;
        }
        else if (minutes < 5) {
            return icon8;
        }
        else if (minutes < 15) {
            return icon7;
        }
        else if (minutes < 45) {
            return icon6;
        }
        else if (minutes < 120) {
            return icon5;
        }
        else if (minutes < 60*5) {
            return icon4;
        }
        else if (minutes < 60*12) {
            return icon3;
        }
        else if (minutes < 60*24) {
            return icon2;
        }
        else {
            return icon1;
        }
    }

    var icon9 = L.MakiMarkers.icon({
        color: color9,
        size: "m"
    });

    var icon8 = L.MakiMarkers.icon({
        color: color8,
        size: "m"
    });

    var icon7 = L.MakiMarkers.icon({
        color: color7,
        size: "m"
    });

    var icon6 = L.MakiMarkers.icon({
        color: color6,
        size: "m"
    });

    var icon5 = L.MakiMarkers.icon({
        color: color5,
        size: "m"
    });

    var icon4 = L.MakiMarkers.icon({
        color: color4,
        size: "m"
    });

    var icon3 = L.MakiMarkers.icon({
        color: color3,
        size: "m"
    });

    var icon2 = L.MakiMarkers.icon({
        color: color2,
        size: "m"
    });

    var icon1 = L.MakiMarkers.icon({
        color: color1,
        size: "m"
    });

    function populateMap() {
        userZonesWithTimestamps = jQuery.parseJSON(userZonesWithTimestamps);
        var data = {
            "zones": userZones,
        };
        $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: "userlocator.php",
            success: function(data) {
                var rightNow = Date.now()
                var allMarkers = [];
                for (var i = 0; i < data.length; i++) {
                    zoneName = data[i][0]["name"];
                    longitude = data[i][0]["longitude"];
                    latitude = data[i][0]["latitude"];
                    timestamp = userZonesWithTimestamps[i][zoneName];
                    var locale_date = parseDate(timestamp);
                    howLongAgo = Math.ceil((rightNow-locale_date)/60000)
                    console.log(howLongAgo)
                    var marker = L.marker([latitude, longitude], {
                        title: zoneName,
                        icon: minutesToIcon(howLongAgo),
                    })
                    marker.bindPopup(howLongAgo.toString() + " min" ).openPopup();
                    allMarkers.push(marker);
                }
                var markerGroup = L.featureGroup(allMarkers)
                var map = L.map('map').fitBounds(markerGroup.getBounds())
                for (var i = 0; i < allMarkers.length; i++) {
                    allMarkers[i].addTo(map);
                }
                L.tileLayer('https://api.tiles.mapbox.com/v4/' + appConfig.mapID + '/{z}/{x}/{y}.png?access_token=' + appConfig.accessToken, {
                    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                    maxZoom: 18,
                    id: appConfig.mapID,
                    accessToken: appConfig.accessToken
                }).addTo(map);
            }
        });
    }
    populateMap();
});
