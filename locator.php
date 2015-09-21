<?php

include 'utils.php';

$north = $_POST["north"]; // lat
$south =  $_POST["south"]; // lat
$east = $_POST["east"]; // long
$west = $_POST["west"]; // long
$name = $_POST["name"];


$sql = "SELECT * FROM zones WHERE latitude > ? AND latitude < ? AND longitude > ? AND longitude < ? AND NOT (name = ?) LIMIT 50";
$params = [$south, $north, $west, $east, $name];
echo json_encode(getFromDb($sql, $params));
