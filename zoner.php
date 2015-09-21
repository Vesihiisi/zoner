<?php

include 'utils.php';

if (isset($_GET['z'])) {
    if (strlen($_GET['z']) == 0) {
        $zone = $defaultzone;
    } else {
        $zone = $_GET['z'];
    }
} else {
    $zone = $defaultzone;
}
$pageTitle = $zone;



function postToApi($array, $url)
{
    $json_encoded = json_encode($array);
    $options = array(
        'http' => array(
            'method' => 'POST',
            'content' => "[" . $json_encoded . "]",
            'header' => "Content-Type: application/json"
        )
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result);
    return $response[0];
}


$responseZone = postToApi(array('name' => $zone), $urlZones);
$zoneName = $responseZone->name;


$sql = "SELECT * FROM zones WHERE name=?";
$params = [$zoneName];
$res = getFromDb($sql, $params);


$zoneLong = $res[0]["longitude"];
$zoneLat = $res[0]["latitude"];
$zoneRegion = $res[0]["region"];
$googleUrl= "http://maps.googleapis.com/maps/api/geocode/json?latlng=$zoneLat,$zoneLong&sensor=true";
$googleData = file_get_contents($googleUrl);
$googleArray = json_decode($googleData, true);
//dump($googleArray["results"][0]["address_components"][2]);
//dump($googleArray["results"][0]["address_components"][3]);

function getRegion($regionID) {
    $sql = "SELECT * FROM regions WHERE regionID=?";
    $params = [$regionID];
    return getFromDb($sql, $params)[0];
}

$regionArray = getRegion($zoneRegion);
$regionName = $regionArray["regionName"];
$country = $regionArray["country"];


$sqlCountryName = "SELECT countryName FROM countries WHERE countryCode=?";
$params = [$country];
$country = getFromDb($sqlCountryName, $params)[0]["countryName"];




$ownerName = $responseZone->currentOwner->name;


$responseUser = postToApi(array('name' => $ownerName), $urlUsers);


$ownerUrl = "https://turfgame.com/user/".$ownerName;
$ownerLevel = $responseUser->rank;
$ownerBlocktime = $responseUser->blocktime;
$ownerOwns = count($responseUser->zones);

$pph = $res[0]["pointsPerHour"];
$takeoverPoints = $res[0]["takeoverPoints"];
$timestamp = $responseZone->dateLastTaken;
$timestampObject = strtotime($timestamp);
$timeTaken = date("d-m-Y H:i", $timestampObject);
$canBeTaken = $timestampObject + 60*$ownerBlocktime;
$canBeTakenPrint = date("H:i", $canBeTaken);

$rightNow = time();

if ($rightNow > $canBeTaken) {
    $canBeTakenIndicator = "";
} else {
    $canBeTakenIndicator = "no";
    $difference = ceil(($canBeTaken - $rightNow)/60);
    $pageTitle = "($canBeTakenPrint) $pageTitle";
    $differencePrint = "($difference min from now)";
    $canBeTakenIndicator = <<<EOD
    →
<span class="$canBeTakenIndicator">$canBeTakenPrint</span>
$differencePrint


EOD;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<script src="config.js"></script>
<link href="css/style.css" rel="stylesheet"/>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" />
<script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
<title><?php echo $pageTitle?> | turf zoner</title>
  <script>
  $(function() {
    console.log("i work");
    $( "#z" ).autocomplete({
      source: "autocomplete.php",
      minLength: 2,
      select: function(event, ui) {
        $(this).val(ui.item.value);
        $(this).parents("form").submit();
   }
    });
  });
  </script>
</head>
<body>

<header>
<div class="header-content">
    <form>
    <input type="search" name="z" id="z" placeholder="Enter search term." value="" autofocus>
    <input type="submit" value="Search">
</form>
</div>
</header>

<main>
<div class="map" id ="map">
&nbsp;
</div>
<script type="text/javascript">
var latitude = "<?php echo $zoneLat; ?>";
var longitude = "<?php echo $zoneLong; ?>";
var map = L.map('map').setView([latitude, longitude], 14);
L.tileLayer('https://api.tiles.mapbox.com/v4/' + appConfig.mapID + '/{z}/{x}/{y}.png?access_token=' + appConfig.accessToken, {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: appConfig.mapID,
    accessToken: appConfig.accessToken
}).addTo(map);
var marker = L.marker([latitude, longitude]).addTo(map);

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

populateMap();

map.on('moveend', function() {
    console.log("re-populating map");
    populateMap();
})



</script>
<div class="info">
<p class="breadcrumb"><?php echo "$country >> $regionName"?></p>
<p><span class="zoneName"><?php echo $zoneName?></span> (<?php echo $takeoverPoints?>, +<?php echo $pph?>)
<a href='#' onclick='location.reload(true); return false;'>refresh</a>
</p>
<p><span class="ownerName"><a href="<?php echo $ownerUrl?>"><?php echo $ownerName?></a></span>
<span class="ownerInfo">(lvl <?php echo $ownerLevel?>, owns <?php echo $ownerOwns?>)</span>
</p>
<p><?php echo $timeTaken?><?php echo $canBeTakenIndicator?>
</p>

</div>
</main>
</body>
</html>
<script src="js/script.js"></script>
