$(document).ready(function() {

    function parseDate(str_date) {
        return new Date(Date.parse(str_date));
    }

    var icon = L.MakiMarkers.icon({
        color: "#b0b",
        size: "m"
    });


    function populateMap() {
        userZonesWithTimestamps = jQuery.parseJSON(userZonesWithTimestamps);
        console.log(userZonesWithTimestamps);
        var data = {
            "zones": userZones,
        };
        $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: "userlocator.php",
            success: function(data) {
                var allMarkers = [];
                for (var i = 0; i < data.length; i++) {
                    zoneName = data[i][0]["name"];
                    longitude = data[i][0]["longitude"];
                    latitude = data[i][0]["latitude"];
                    timestamp = userZonesWithTimestamps[i][zoneName];
                    var locale_date = parseDate(timestamp);
                    var marker = L.marker([latitude, longitude], {
                        title: zoneName + " " + locale_date,
                        icon: icon,
                    })
                    allMarkers.push(marker);
                }
                var markerGroup = L.featureGroup(allMarkers)
                var map = L.map('map').fitBounds(markerGroup.getBounds())
                for (var i = 0; i < allMarkers.length; i++) {
                    allMarkers[i].addTo(map)
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
