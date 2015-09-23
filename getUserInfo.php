<?php

include 'utils.php';

$data = $_POST;

$options = array(
    'http' => array(
        'method' => 'POST',
        'content' => "[" . json_encode($data) . "]",
        'header' => "Content-Type: application/json"
    )
);
$context  = stream_context_create($options);
$url = $urlUsers;
$result = file_get_contents($url, false, $context);
echo $result;
