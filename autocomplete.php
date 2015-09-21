<?php

include 'utils.php';

$term = trim(strip_tags($_GET['term']));
$term = $term."%";



$sql = "SELECT name FROM zones WHERE name LIKE ? ORDER BY name LIMIT 15";
$params = [$term];
$res = getFromDb($sql, $params);

$suggestions = array();

for ($i = 0; $i < count($res); ++$i) {
        array_push($suggestions, $res[$i]["name"]);
}

echo json_encode($suggestions);
