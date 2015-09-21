<?php

$defaultzone = "LindChalm";
date_default_timezone_set('Europe/Stockholm');
$urlUsers = 'http://api.turfgame.com/v4/users';
$urlZones = 'http://api.turfgame.com/v4/zones';
$urlZonesAll = "http://api.turfgame.com/v4/zones/all";
$urlRegions = "http://api.turfgame.com/v4/regions";

define('DATABASE', __DIR__ . "/db/turf.sqlite", true);


function dump($array)
{
    echo "<pre>" . htmlentities(print_r($array, 1)) . "</pre>";
}

function postToApi($array, $url)
{
    $json_encoded = json_encode($array);
    $options = array(
        'http' => array(
            'method' => 'POST',
            'content' => "[" . $json_encoded . "]",
            'header' => "Content-Type: application/json"
        )
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    $response = json_decode($result);
    return $response[0];
}

function connectToDb($filename)
{
    $dsn = "sqlite:$filename";
    try {
        $db = new PDO($dsn);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    }
    catch(PDOException $e) {
        echo "Failed to connect to the database using DSN:<br />$dsn<br />";
        throw $e;
    }
}

function getFromDb($query, $params)
{
    $db = connectToDb(DATABASE);
    $stmt = $db->prepare($query);
    $stmt->execute($params);
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $res;
}
