<?php 

$responseUser = postToApi(array('name' => $user), $urlUsers);
$userName = $responseUser->name;
$userRegion = $responseUser->region;
$userBlocktime = $responseUser->blocktime;
$userZones = $responseUser->zones;
$userRank = $responseUser->rank;

$userZonesWithTimestamps = array();

for ($i=0;$i<count($userZones); $i=$i+1) {
    $responseZone = postToApi(array('id' => $userZones[$i]), $urlZones);
    $timestamp = $responseZone->dateLastTaken;
    $entry = array( $responseZone->name => $timestamp);
    array_push($userZonesWithTimestamps, $entry);
}
