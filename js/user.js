$(document).ready(function() {

    function populateMap() {
        console.log(userName);
        var north = map.getBounds().getNorth();
        var east = map.getBounds().getEast();
        var south = map.getBounds().getSouth();
        var west = map.getBounds().getWest();
        var data = {
            "name": userName,
            "zones": userZones,
            "north": north,
            "east": east,
            "south": south,
            "west": west
        };
        $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: "userlocator.php",
            success: function(data) {
                console.log(data.length);
                for (var i = 0; i < data.length; i++) {
                    zoneName = data[i][0]["name"];
                    longitude = data[i][0]["longitude"];
                    latitude = data[i][0]["latitude"];
                    var marker = L.marker([latitude, longitude], {
                        title: zoneName,
                    }).addTo(map);
                }
            }
        });
    }


    var map = L.map('map').setView([latitude, longitude], 10);
    var marker = L.marker([latitude, longitude]).addTo(map);

    L.tileLayer('https://api.tiles.mapbox.com/v4/' + appConfig.mapID + '/{z}/{x}/{y}.png?access_token=' + appConfig.accessToken, {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: appConfig.mapID,
        accessToken: appConfig.accessToken
    }).addTo(map);

    populateMap();

    map.on('moveend', function() {
        console.log("re-populating map");
    })

});
