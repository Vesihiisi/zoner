<?php

include 'utils.php';

$north = $_POST["north"]; // lat
$south =  $_POST["south"]; // lat
$east = $_POST["east"]; // long
$west = $_POST["west"]; // long
$name = $_POST["name"];
$exclude = $_POST["exclude"];
$excludeArray = json_decode($exclude, true);


$sql = "SELECT * FROM zones WHERE latitude > ? AND latitude < ? AND longitude > ? AND longitude < ? AND name NOT IN ( '" . implode($excludeArray, "', '") . "' )";
$params = [$south, $north, $west, $east];
echo json_encode(getFromDb($sql, $params));
