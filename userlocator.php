<?php

include 'utils.php';

$zones = $_POST["zones"];
$zones = json_decode($zones);

$results = array();

for ($i=0; $i<count($zones);$i=$i+1) {
    $sql = "SELECT name, longitude, latitude FROM zones WHERE id = ?";
    $params = [$zones[$i]];
    array_push($results, getFromDb($sql, $params));
}

echo json_encode($results);


// $sql = "SELECT * FROM zones WHERE id = ?";
// $params = [$id];
// echo json_encode(getFromDb($sql, $params));
