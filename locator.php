<?php

function dump($array)
{
    echo "<pre>" . htmlentities(print_r($array, 1)) . "</pre>";
}

define('DATABASE', __DIR__ . "/db/turf.sqlite", true);

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

$north = 57.7114380143323; // lat
$south =  57.70226698381177; // lat

$east = 11.947417259216307; // long
$west = 11.928491592407227; // long

$db = connectToDb(DATABASE);
$sql = "SELECT * FROM zones WHERE latitude > ? AND latitude < ? AND longitude > ? AND longitude < ?";
$params = [$south, $north, $west, $east];
$stmt = $db->prepare($sql);
$stmt->execute($params);
$res = $stmt->fetchAll(PDO::FETCH_ASSOC);

dump($res);
