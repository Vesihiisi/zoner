<?php

$term = trim(strip_tags($_GET['term']));

$allZones = array(
    "Backaplaneten",
    "Basarzone",
    "ByThePlus",
    "Eketräbussen",
    "Eriksmount",
    "Förmansparken",
    "GAZone",
    "Gullris",
    "GötaCentral",
    "HjalmarZone",
    "Kopparmärra",
    "LindChalm",
    "Pusterzone",
    "Queenspark",
    "Shipside",
    "Vickanzone",
    "WalkOnWater",);

$suggestions = array();

for ($i = 0; $i < count($allZones); ++$i) {
    if (stripos($allZones[$i], $term) !== false) {
        array_push($suggestions, $allZones[$i]);
    }
}

echo json_encode($suggestions);
