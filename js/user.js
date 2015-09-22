$(document).ready(function() {

    function parseDate(str_date) {
        return new Date(Date.parse(str_date));
    }

    function minutesToIcon(minutes) {
        if (minutes < 60) {
            return iconRed;
        }
        else {
            return iconBlue;
        }
    }

    var iconRed = L.MakiMarkers.icon({
        color: "#EA1010",
        size: "m"
    });

    var iconBlue = L.MakiMarkers.icon({
        color: "#86989F",
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
