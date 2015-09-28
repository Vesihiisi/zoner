$(document).ready(function() {

    var colors = ["#69d2e7",
        "#ffffcc",
        "#ffeda0",
        "#fed976",
        "#feb24c",
        "#fd8d3c",
        "#fc4e2a",
        "#e31a1c",
        "#bd0026",
        "#800026"
    ]

    var icons = createColoredMarkers();
    var allMarkers = new L.LayerGroup();
    var coloredMarkers = new L.LayerGroup()
    var circles = new L.LayerGroup()
    var myMarker = L.Marker.extend({
        options: {
            zoneName: null,
            active: false,
            riseOnHover: true
        }
    })

    function parseDate(str_date) {
        return new Date(Date.parse(str_date));
    }

    function minutesToIcon(minutes) {
        if (minutes < 2) {
            return 9;
        } else if (minutes < 5) {
            return 8;
        } else if (minutes < 15) {
            return 7;
        } else if (minutes < 45) {
            return 6;
        } else if (minutes < 120) {
            return 5;
        } else if (minutes < 60 * 5) {
            return 4;
        } else if (minutes < 60 * 12) {
            return 3;
        } else if (minutes < 60 * 24) {
            return 2;
        } else {
            return 1;
        }
    }

    function createColoredMarkers() {
        var icons = [];
        for (i = 0; i < colors.length; i++) {
            icons.push(
                new L.MakiMarkers.icon({
                    color: colors[i],
                    size: "s"
                })
            );
        }
        return icons;
    }

    function createMap(where) {
        var map = L.map(where).setView([57.708, 11.975], 13);
        map.locate({
            setView: true,
            maxZoom: 15,
        });
        L.tileLayer('https://api.tiles.mapbox.com/v4/' + appConfig.mapID + '/{z}/{x}/{y}.png?access_token=' + appConfig.accessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: appConfig.mapID,
            accessToken: appConfig.accessToken
        }).addTo(map);
        allMarkers.addTo(map)
        circles.addTo(map)
        return map
    }

    function createMarker(coords) {
        var marker = new myMarker(coords, {
            zoneName: zoneName,
            title: zoneName,
        });
        marker.setIcon(icons[0])
        marker.bindLabel(zoneName)
        marker.setOpacity(0.5)
        allMarkers.addLayer(marker)
        return marker
    }

    function selectMarker(marker) {
        circles.clearLayers()
        var circle = new L.circle(marker.getLatLng(), 150, {
            fill: false,
            color: "red",
            fillOpacity: 0.5
        })
        console.log(circle)
        console.log(circles)
        circles.addLayer(circle)

    }

    function mapData(zoneData) {
        for (var i = 0; i < zoneData.length; i++) {
            zoneName = zoneData[i]["name"];
            latitude = zoneData[i]["latitude"];
            longitude = zoneData[i]["longitude"];
            var marker = createMarker([latitude, longitude])
            addHandlerToMarker(marker)
        }
    }

    function populateMap(map) {
        function ajax(data) {
            return $.ajax({
                type: "POST",
                data: data,
                dataType: "json",
                url: "locator.php"
            })
        }
        var north = map.getBounds().getNorth();
        var east = map.getBounds().getEast();
        var south = map.getBounds().getSouth();
        var west = map.getBounds().getWest();
        var allZoneNames = [];
        var geoData = {
            "name": "<?php echo $zoneName; ?>",
            "north": north,
            "east": east,
            "south": south,
            "west": west,
            "exclude": JSON.stringify(allZoneNames),
        };
        allMarkers.eachLayer(function(layer) {
            allZoneNames.push(layer.options.zoneName)
        })
        coloredMarkers.eachLayer(function(layer) {
            allZoneNames.push(layer.options.zoneName)
        })
        ajax(geoData).done(function(result) {
            mapData(result)
        })
    }


    function printInfoZone(nameOrId) {
        function fillInfobox(zoneData) {
            console.log(zoneData[0])
            var zoneName = zoneData[0]["name"];
            var currentOwner = zoneData[0]["currentOwner"]["name"];
            var takeoverPoints = zoneData[0]["takeoverPoints"];
            var pph = zoneData[0]["pointsPerHour"]
            var lastTaken = zoneData[0]["dateLastTaken"]
            locale_date = parseDate(lastTaken)
            console.log(currentOwner)
            $(".zoneName").html(zoneName);
            $(".zoneName").append(" (" + takeoverPoints.toString() + ", +" + pph.toString() + ")")
            $(".ownerName").html(currentOwner);
            $(".taken").html("Taken: " + $.format.date(locale_date, "dd/MM/yyyy HH:mm:ss"))
            $(".taken").append(" (" + $.format.prettyDate(locale_date) + ")")
        }

        function ajax(data) {
            return $.ajax({
                type: "POST",
                data: data,
                dataType: "json",
                url: "getZoneInfo.php"
            })
        }
        if (typeof(nameOrId) === 'number') {
            var data = {
                id: nameOrId,
            }
        } else if (typeof(nameOrId) === 'string') {
            var data = {
                name: nameOrId,
            }
        }
        ajax(data).done(function(result) {
            fillInfobox(result)
        })
    }

    function markerClicker() {
        var zoneName = this.options.zoneName;
        selectMarker(this)
        printInfoZone(zoneName)
    }

    function addHandlerToMarker(marker) {
        marker.on("click", markerClicker)
    }

    function main() {
        var map = createMap('map');
        populateMap(map);
    }

    main()

});
