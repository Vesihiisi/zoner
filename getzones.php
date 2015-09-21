<?php
include 'utils.php';

$time_start = microtime(true);

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

function getRegions() {
    $data = file_get_contents($urlRegions);
    $array = json_decode($data, true);
    echo count($array);
    return $array;
}


function insertRegions($array) {
    for ($i = 0; $i < count($array); ++$i) {
        $regionID = $array[$i]["id"];
        $sql = "SELECT * FROM regions WHERE regionID=? LIMIT 1";
        $params = [$regionID];
        $res = getFromDb($sql, $params);
        if (count($res) == 0) {
            $regionName = $array[$i]["name"];
            if (array_key_exists("country", $array[$i])) {
                $country = $array[$i]["country"];
            } else {
                $country = null;
            }
            $params = [$regionID, $regionName, $country];
            $db = connectToDb(DATABASE);
            $query = "INSERT INTO regions VALUES (?, ?, ?)";
            $stmt = $db->prepare($query);
            $stmt->execute($params);
        }
    }

}

function addNewRegionsToDb() {
    $regionsData = getRegions();
    insertRegions($regionsData);
}


$opts = array(
    'http' => array(
        'header' => 'Accept-Encoding: gzip'
    ) ,
);
$context = stream_context_create($opts);

$data = file_get_contents($urlZonesAll, false, $context);
$data_decoded = gzdecode($data);
$array = json_decode($data_decoded, true);
echo "number of elements in array: " .count($array) . "<br>";


$time_end = microtime(true);
$execution_time = $time_end - $time_start;
echo '<b>Total Execution Time: </b> ' . $execution_time;
