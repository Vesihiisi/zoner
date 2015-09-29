<?php
include 'utils.php';

function getDbLength() {
    $sql = "SELECT COUNT(*) FROM zones";
    $params = [];
    $res = getFromDb($sql, $params);
    $res = $res[0]["COUNT(*)"];
    echo $res;
}

getDbLength();
