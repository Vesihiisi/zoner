<?php

$defaultzone = "LindChalm";
date_default_timezone_set('Europe/Stockholm');
$urlUsers = 'http://api.turfgame.com/v4/users';
$urlZones = 'http://api.turfgame.com/v4/zones';

define('DATABASE', __DIR__ . "/db/turf.sqlite", true);

function dump($array)
{
    echo "<pre>" . htmlentities(print_r($array, 1)) . "</pre>";
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


