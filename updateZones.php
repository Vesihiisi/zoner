<?php
include 'utils.php';

function getAllZones() {
    $opts = array(
        'http' => array(
        'header' => 'Accept-Encoding: gzip'
    ) ,
        );
    $context = stream_context_create($opts);
    $data = file_get_contents("http://api.turfgame.com/v4/zones/all", false, $context);
    $data_decoded = gzdecode($data);
    $array = json_decode($data_decoded, true);
    return $array;
}

function updateZones($array) {
    $time_start = microtime(true);
    for ($i = 0; $i < count($array); ++$i) {
        $id = $array[$i]["id"];
        $name = $array[$i]["name"];
        $region = $array[$i]["region"]["id"];
        $totalTakeovers = $array[$i]["totalTakeovers"];
        $takeoverPoints = $array[$i]["takeoverPoints"];
        $pointsPerHour = $array[$i]["pointsPerHour"];
        $longitude = $array[$i]["longitude"];
        $latitude = $array[$i]["latitude"];
        $db = connectToDb(DATABASE);
        $query = "UPDATE zones SET name = ?, region = ?, totalTakeovers = ?, takeoverPoints = ?, pointsPerHour = ?, longitude = ?, latitude = ? WHERE id = ?";
        $params = [$name, $region, $totalTakeovers, $takeoverPoints, $pointsPerHour, $longitude, $latitude, $id];
        $stmt = $db->prepare($query);
        $stmt->execute($params);

    }
    $time_end = microtime(true);
    $execution_time = $time_end - $time_start;
    echo 'Total Execution Time: ' . $execution_time;
}

updateZones(getAllZones());
