$(document).ready(function() {

    function minutesToIcon(minutes) {
        if (minutes < 2) {
            return icon9;
        } else if (minutes < 5) {
            return icon8;
        } else if (minutes < 15) {
            return icon7;
        } else if (minutes < 45) {
            return icon6;
        } else if (minutes < 120) {
            return icon5;
        } else if (minutes < 60 * 5) {
            return icon4;
        } else if (minutes < 60 * 12) {
            return icon3;
        } else if (minutes < 60 * 24) {
            return icon2;
        } else {
            return icon1;
        }
    }

    var color1 = "#ffffcc";
    var color2 = "#ffeda0";
    var color3 = "#fed976";
    var color4 = "#feb24c";
    var color5 = "#fd8d3c";
    var color6 = "#fc4e2a";
    var color7 = "#e31a1c";
    var color8 = "#bd0026";
    var color9 = "#800026";

    var iconDefault = L.MakiMarkers.icon({
        color: "#7E7E7E",
        size: "s"
    });

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

    var icon = L.MakiMarkers.icon({
        color: "#8CA8CB",
        size: "m"
    });

    var allZones = new L.LayerGroup();
    var coloredMarkers = new L.LayerGroup()


    var myMarker = L.Marker.extend({
        options: {
            zoneName: null,
            active: false,
            riseOnHover: true
        }
    })

    var iconDefault = L.MakiMarkers.icon({
        color: "#7E7E7E",
        size: "s"
    });

    function createMap(where) {
        var map = L.map(where).setView([57.708, 11.975], 13);
        map.locate({
            setView: true,
            maxZoom: 15
        });
        L.tileLayer('https://api.tiles.mapbox.com/v4/' + appConfig.mapID + '/{z}/{x}/{y}.png?access_token=' + appConfig.accessToken, {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: appConfig.mapID,
            accessToken: appConfig.accessToken
        }).addTo(map);
        return map
    }

    function saveInfo(data) {
        return data;
    }

    function parseDate(str_date) {
        return new Date(Date.parse(str_date));
    }


    function howLongAgo(timestamp) {

        rightNow = Date.now()
        locale_date = parseDate(timestamp);
        return Math.ceil((rightNow - locale_date) / 60000)
    }

    function restoreMarker(marker, icon) {
        if (icon == iconDefault) {
            opacity = 0.5
        } else {
            opacity = 1
        }
        coords = marker.getLatLng()
        zoneName = marker.options.zoneName;
        marker = new myMarker(coords, {
            zoneName: zoneName,
            title: zoneName,
            active: false,
            icon: icon,
        });
        marker.setOpacity(opacity)
        marker.bindLabel(zoneName)
        marker.on("click", markerClicker)
        return marker
    }

    function resetAll(array) {
        for (i = 0; i < array.length; i++) {
            map.removeLayer(array[i])
        }
    }

    function colorMarker(data) {
        zoneInfo = saveInfo(data);
        zoneName = zoneInfo[0].name
        dateLastTaken = zoneInfo[0].dateLastTaken
        timeDelta = howLongAgo(dateLastTaken)
        allZones.eachLayer(function(layer) {
            if (layer.options.zoneName == zoneName) {
                allZones.removeLayer(layer)
                marker = restoreMarker(layer, minutesToIcon(timeDelta))
                coloredMarkers.addLayer(marker)
                console.log(coloredMarkers.getLayers().length)
            }
        })
    }

    function resetAllColored() {
        coloredMarkers.eachLayer(function(layer) {
            marker = restoreMarker(layer, iconDefault)
            coloredMarkers.removeLayer(marker)
            coloredMarkers.removeLayer(layer)
            allZones.addLayer(marker)

        })
        coloredMarkers.clearLayers()
    }

    function getUsersAllZones(data) {
        userInfo = saveInfo(data)[0]
        userRank = userInfo["rank"]
        userBlocktime = userInfo["blocktime"]
        usersZones = userInfo.zones
        owns = usersZones.length
        $(".owner").append(" (lvl " + userRank + ", " + owns + "z )")
        for (i = 0; i < usersZones.length; i++) {
            $.ajax({
                type: "POST",
                url: "getZoneInfo.php",
                dataType: "json",
                data: {
                    "id": usersZones[i],
                },
                success: function(data) {
                    colorMarker(data)
                }
            })
        }
    }

    function getInfoAboutOwner(data) {
        function getUsersAllZones(data) {
            userInfo = saveInfo(data)[0]
            userRank = userInfo["rank"]
            userBlocktime = userInfo["blocktime"]
            unblocked = new Date();
            unblocked.setTime(locale_date.getTime() + userBlocktime * 60 * 1000)
            console.log(locale_date)
            console.log(unblocked)
            if (unblocked > Date.now()) {
                $(".taken").append("BLOCKED!!!!!!!!!")
            }
            usersZones = userInfo.zones
            owns = usersZones.length
            $(".owner").append(" (lvl " + userRank + ", " + owns + "z )")
            for (i = 0; i < usersZones.length; i++) {
                $.ajax({
                    type: "POST",
                    url: "getZoneInfo.php",
                    dataType: "json",
                    data: {
                        "id": usersZones[i],
                    },
                    success: function(data) {
                        colorMarker(data)
                    }
                })
            }
        }
        data = saveInfo(data)[0];
        takeoverPoints = data["takeoverPoints"]
        pph = data["pointsPerHour"]
        owner = data["currentOwner"]["name"]
        lastTaken = data["dateLastTaken"]
        console.log(lastTaken)
        locale_date = parseDate(lastTaken)
        $(".owner").html("owner: " + owner)
        $(".zoneName").append(" (" + takeoverPoints.toString() + ", +" + pph.toString() + ")")
        $(".taken").append("taken: " + $.format.date(locale_date, "dd/MM/yyyy HH:mm:ss"))
        $(".taken").append(" (" + $.format.prettyDate(locale_date) + ")")
        zonesOwnedByThisPerson = []
        console.log(owner)
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "getUserInfo.php",
            data: {
                "name": owner,
            },
            dataType: "json",
            success: function(data) {
                getUsersAllZones(data)
            }
        });
    }

    function markerClicker() {
        if ($(".info").is(":visible")) {
            console.log()
        } else {
            $(".info").fadeIn("fast")
        }
        console.log(this.options.zoneName)
        console.log(this.options.active)
        $(".info-header").children().html("")
        $(".info-user").children().html("")
        $(".info-taken").children().html("")
        $(".zoneName").html(this.options.zoneName)
        if (coloredMarkers.getLayers().length > 0) {
            resetAllColored()
        }
        $.ajax({
            type: "POST",
            url: "getZoneInfo.php",
            dataType: "json",
            data: {
                "name": this.options.zoneName,
            },
            success: function(data) {
                getInfoAboutOwner(data)
            }
        })
    }

    function mapData(data) {
        data = saveInfo(data);
        for (var i = 0; i < data.length; i++) {
            zoneName = data[i]["name"];
            latitude = data[i]["latitude"];
            longitude = data[i]["longitude"];
            var marker = new myMarker([latitude, longitude], {
                zoneName: zoneName,
                title: zoneName,
                icon: iconDefault,
            });
            marker.setOpacity(0.5)
            marker.bindLabel(zoneName)
            marker.on('click', markerClicker)
            allZones.addLayer(marker)
            allZones.addTo(map)
            coloredMarkers.addTo(map)
        }
    }

    function populateMap(map) {
        var north = map.getBounds().getNorth();
        var east = map.getBounds().getEast();
        var south = map.getBounds().getSouth();
        var west = map.getBounds().getWest();
        var allZoneNames = [];
        allZones.eachLayer(function(layer) {
            allZoneNames.push(layer.options.zoneName)
        })
        coloredMarkers.eachLayer(function(layer) {
            allZoneNames.push(layer.options.zoneName)
        })
        var data = {
            "name": "<?php echo $zoneName; ?>",
            "north": north,
            "east": east,
            "south": south,
            "west": west,
            "exclude": JSON.stringify(allZoneNames),
        };
        $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: "locator.php",
            success: function(data) {
                mapData(data)
            }
        });
    }

    function panToZone(zoneName) {
        var data = {
            "name": zoneName,
        }
        $.ajax({
            type: "POST",
            data: data,
            dataType: "json",
            url: "getZoneInfo.php",
            success: function(data) {
                var latLong = getZoneCoords(data)
                map.setView([latLong[0], latLong[1]], 13);
            }
        });
    }

    function getZoneCoords(data) {
        var latLong = []
        latLong.push(data[0].latitude)
        latLong.push(data[0].longitude)
        console.log(latLong)
        return latLong
    }


    var map = createMap('map');
    populateMap(map)
    $(".info").hide();

    map.on('moveend', function() {
        console.log("re-populating map");
        populateMap(map);
    })

    $("#z").autocomplete({
        source: "autocomplete.php",
        minLength: 2,
        select: function(event, ui) {
            $(this).val(ui.item.value);
            if (event.keyCode == 13) {
                $('#z').submit()
            }
        }
    });

    $("#searchForm").on('submit', function(e) {
        e.preventDefault()
        panToZone($("#z").val())
    })

});
