<?php
include 'utils.php';

function getNoOfZones() {
    $opts = array(
        'http' => array(
        'header' => 'Accept-Encoding: gzip'
    ) ,
        );
    $context = stream_context_create($opts);
    $data = file_get_contents("http://api.turfgame.com/v4/zones/all", false, $context);
    $data_decoded = gzdecode($data);
    $array = json_decode($data_decoded, true);
    echo count($array);
}

getNoOfZones();
