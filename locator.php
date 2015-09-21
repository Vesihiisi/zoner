<?php

include 'utils.php';

// $north = 57.7114380143323; // lat
// $south =  57.70226698381177; // lat
// $east = 11.947417259216307; // long
// $west = 11.928491592407227; // long
// 
$north = $_POST["north"]; // lat
$south =  $_POST["south"]; // lat
$east = $_POST["east"]; // long
$west = $_POST["west"]; // long
$name = $_POST["name"];

$db = connectToDb(DATABASE);
$sql = "SELECT * FROM zones WHERE latitude > ? AND latitude < ? AND longitude > ? AND longitude < ? AND NOT (name = ?) LIMIT 50";
$params = [$south, $north, $west, $east, $name];
$stmt = $db->prepare($sql);
$stmt->execute($params);
$res = $stmt->fetchAll(PDO::FETCH_ASSOC);
$resJson = json_encode($res);

echo $resJson;
