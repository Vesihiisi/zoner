<?php

include 'utils.php';

$term = trim(strip_tags($_GET['term']));
$term = $term."%";

$db = connectToDb(DATABASE);

$sql = "SELECT name FROM zones WHERE name LIKE ? ORDER BY name LIMIT 15";
$params = [$term];
$stmt = $db->prepare($sql);
$stmt->execute($params);
$res = $stmt->fetchAll(PDO::FETCH_ASSOC);

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

for ($i = 0; $i < count($res); ++$i) {
        array_push($suggestions, $res[$i]["name"]);
}

echo json_encode($suggestions);
