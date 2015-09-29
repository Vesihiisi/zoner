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

function insertZones($array)
{
    for ($i = 0; $i < count($array); ++$i)
        {
        $zoneID = $array[$i]["id"];
        $sql = "SELECT * FROM zones WHERE id=? LIMIT 1";
        $params = [$zoneID];
        $res = getFromDb($sql, $params);
        if (count($res) == 0)
            {
            $id = $zoneID;
            $name = $array[$i]["name"];
            $region = $array[$i]["region"]["id"];
            $totalTakeovers = $array[$i]["totalTakeovers"];
            $takeoverPoints = $array[$i]["takeoverPoints"];
            $pointsPerHour = $array[$i]["pointsPerHour"];
            $dateCreated = $array[$i]["dateCreated"];
            $longitude = $array[$i]["longitude"];
            $latitude = $array[$i]["latitude"];
            $params = [$id, $name, $region, $totalTakeovers, $takeoverPoints, $pointsPerHour, $dateCreated, $longitude, $latitude];
            $db = connectToDb(DATABASE);
            $query = "INSERT INTO zones VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
            $stmt = $db->prepare($query);
            $stmt->execute($params);
            }
        }
}

insertZones(getAllZones());
