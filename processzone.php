<?php 
function getRegion($regionID) {
    $sql = "SELECT * FROM regions WHERE regionID=?";
    $params = [$regionID];
    return getFromDb($sql, $params)[0];
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



$regionArray = getRegion($zoneRegion);
$regionName = $regionArray["regionName"];
$country = $regionArray["country"];


$sqlCountryName = "SELECT countryName FROM countries WHERE countryCode=?";
$params = [$country];
$country = getFromDb($sqlCountryName, $params)[0]["countryName"];




$ownerName = $responseZone->currentOwner->name;


$responseUser = postToApi(array('name' => $ownerName), $urlUsers);


$ownerUrl = "userinfo.php?u=".$ownerName;
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
