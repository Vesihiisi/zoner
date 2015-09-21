<?php 

$responseUser = postToApi(array('name' => $user), $urlUsers);
$userName = $responseUser->name;
$userRegion = $responseUser->region;
$userBlocktime = $responseUser->blocktime;
$userZones = $responseUser->zones;
$userRank = $responseUser->rank;



