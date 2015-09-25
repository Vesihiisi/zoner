$(document).ready(function() {

    var lastClickedOn;

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

    var colors = ["#7E7E7E",
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

    var icons = []

    for (i = 0; i < colors.length; i++) {
        icons.push(
            L.MakiMarkers.icon({
                color: colors[i],
                size: "s"
            })
        )
    }


    var allZones = new L.LayerGroup();
    var coloredMarkers = new L.LayerGroup()
    var circles = new L.LayerGroup()


    var myMarker = L.Marker.extend({
        options: {
            zoneName: null,
            active: false,
            riseOnHover: true
        }
    })

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

    function restoreMarker(marker, iconNo) {
        coords = marker.getLatLng()
        zoneName = marker.options.zoneName;
        marker = new myMarker(coords, {
            zoneName: zoneName,
            title: zoneName,
            active: false,
            icon: icons[iconNo],
        });
        if (iconNo == 0) {
            marker.setOpacity(0.5)
        }
        marker.bindLabel(zoneName)
        marker.on("click", markerClicker)
        return marker
    }

    function colorMarker(data) {
        zoneInfo = saveInfo(data);
        zoneName = zoneInfo[0].name
        dateLastTaken = zoneInfo[0].dateLastTaken
        timeDelta = howLongAgo(dateLastTaken)
        allZones.eachLayer(function(layer) {
            if (layer.options.zoneName == zoneName) {
                layer.setIcon(icons[minutesToIcon(timeDelta)])
                layer.setOpacity(1)
                coloredMarkers.addLayer(layer)
                console.log(coloredMarkers.getLayers().length)
            }
        })
    }

    function resetAllColored() {
        coloredMarkers.eachLayer(function(layer) {
            layer.setIcon(icons[0])
            layer.setOpacity(0.5)
            coloredMarkers.removeLayer(layer)
            allZones.addLayer(layer)
        })
    }

    function getUsersAllZones(data) {
        userInfo = saveInfo(data)[0]
        userRank = userInfo["rank"]
        userBlocktime = userInfo["blocktime"]
        usersZones = userInfo.zones
        owns = usersZones.length
        $(".ownerRank").append(userRank)
        $(".numberOfZones").append(owns)
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

    function printZoneInfo(zoneData) {
        clearInfobox()
        zoneData = saveInfo(zoneData)
        zoneName = zoneData["name"]
        takeoverPoints = zoneData["takeoverPoints"];
        pph = zoneData["pointsPerHour"]
        lastTaken = zoneData["dateLastTaken"]
        owner = zoneData["currentOwner"]["name"]
        locale_date = parseDate(lastTaken)
        $(".zoneName").html(zoneName)
        $(".ownerName").html("owner: " + owner)
        $(".zoneName").append(" (" + takeoverPoints.toString() + ", +" + pph.toString() + ")")
        $(".taken").append("taken: " + $.format.date(locale_date, "dd/MM/yyyy HH:mm:ss"))
        $(".taken").append(" (" + $.format.prettyDate(locale_date) + ")")
    }

    function getInfoAboutOwner(data) {
        data = saveInfo(data)[0];
        printZoneInfo(data)
        owner = data["currentOwner"]["name"]
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

    function clearInfobox() {
        $(".info-header").children().html("")
        $(".info-user").children().html("")
        $(".info-taken").children().html("")
    }

    function markerClicker() {
        if ($(".info").is(":visible")) {
            console.log()
        } else {
            $(".info").fadeIn("fast")
        }
        if (lastClickedOn == this) {
            console.log("FAIL")
        } else {
            lastClickedOn = this
            select(this)
            if (coloredMarkers.hasLayer(this)) {
                console.log("COLORED")
                $.ajax({
                    type: "POST",
                    url: "getZoneInfo.php",
                    dataType: "json",
                    data: {
                        "name": this.options.zoneName,
                    },
                    success: function(data) {
                        data = saveInfo(data[0])
                        printZoneInfo(data)
                    }
                })

            } else {
                clearInfobox()
                
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

        }


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
            });
            marker.setIcon(icons[0])
            marker.bindLabel(zoneName)
            marker.setOpacity(0.5)
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

    function markSelected(marker) {
        circles.clearLayers()
        var circle = new L.circle(marker.getLatLng(), 150, {
            fill: false,
            color: "red",
            fillOpacity: 0.5
        })
        circles.addLayer(circle)
        circles.addTo(map)
    }

    function select(marker) {
        markSelected(marker)
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
                map.setView([latLong[0], latLong[1]]);
                console.log(zoneName)
                setTimeout(function() {
                    allZones.eachLayer(function(layer) {
                        if (layer.options.zoneName == zoneName) {
                            console.log("FOUND")
                            select(layer)
                        }
                    })
                }, 100); // horrible, terrible hack :< :S :D

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

    $("#search").click(function() {
        console.log("clicked")
        panToZone($("#z").val())
    })

});
