$(document).ready(function() {

    function populateMap() {
        var north = map.getBounds().getNorth();
        var east = map.getBounds().getEast();
        var south = map.getBounds().getSouth();
        var west = map.getBounds().getWest();
        var data = {
            "name": "<?php echo $zoneName; ?>",
            "north": north,
            "east": east,
            "south": south,
            "west": west
        };
        $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: "locator.php",
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    zoneName = data[i]["name"];
                    latitude = data[i]["latitude"];
                    longitude = data[i]["longitude"];
                    var marker = L.marker([latitude, longitude], {
                        title: zoneName,
                    }).addTo(map);
                    marker.on('click', function() {
                        var url = "?z=" + this.options.title;
                        window.location.href = url;
                    })
                }
            }
        });
    }


    var map = L.map('map').setView([latitude, longitude], 14);
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
        populateMap();
    })


    $("#z").autocomplete({
        source: "autocomplete.php",
        minLength: 2,
        select: function(event, ui) {
            $(this).val(ui.item.value);
            $(this).parents("form").submit();
        }
    });


});
