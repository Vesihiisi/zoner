<?php

define('DATABASE', __DIR__ . "/db/turf.sqlite", true);

function dump($array)
    {
    echo "<pre>" . htmlentities(print_r($array, 1)) . "</pre>";
    }

function connectToDb($filename)
    {
    $dsn = "sqlite:$filename";
    try
        {
        $db = new PDO($dsn);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
        }

    catch(PDOException $e)
        {
        echo "Failed to connect to the database using DSN:<br />$dsn<br />";
        throw $e;
        }
    }

$term = trim(strip_tags($_GET['term']));
$term = "%".$term."%";

$db = connectToDb(DATABASE);

$sql = "SELECT name FROM zones WHERE name LIKE ?";
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
