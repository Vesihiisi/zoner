<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>

<script src="config.js"></script>
<link href="css/style.css" rel="stylesheet"/>
<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" />
<script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>
<script src="js/Leaflet.MakiMarkers.js"></script>
<script src="js/jquery-dateFormat.min.js"></script>
<script src="js/script.js"></script>
<title><?php echo $pageTitle?> | turf zoner</title>
</head>
<body>
<?php include("header.php");?>
<?php include("zoner.php");?>
<main>
<div class="map" id ="map">
<div class="info" id="info">
<div class="info-header"><p class="zoneName"></p></div>
<div class="info-body">
    <div class="info-zone"><p class="zoneData"></p></div>
    <div class="info-user"><p class="owner"></p></div>
    <div class="info-taken"><p class="taken"></p></div>
</div>
</div>
</div>
<script type="text/javascript">
var latitude = "<?php echo $zoneLat; ?>";
var longitude = "<?php echo $zoneLong; ?>";
</script>

</main>
</body>
</html>
