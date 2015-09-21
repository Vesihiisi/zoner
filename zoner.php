<?php

include 'utils.php';

if (isset($_GET['z'])) {
    if (strlen($_GET['z']) == 0) {
        $zone = $defaultzone;
    } else {
        $zone = $_GET['z'];
    }
    include("processzone.php");
} else {
    $zone = $defaultzone;
    include("processzone.php");
}

if (isset($_GET['u'])) {
    $user = $_GET['u'];
    include("processuser.php");
}
