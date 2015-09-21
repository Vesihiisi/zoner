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
<script src="js/user.js"></script>
<title><?php echo $pageTitle?> | turf zoner</title>
</head>
<body>
<?php include("header.php");?>
<?php include("zoner.php");?>
<main>
<div class="map" id ="map">
&nbsp;
</div>
<script type="text/javascript">
var latitude = "<?php echo $zoneLat; ?>";
var longitude = "<?php echo $zoneLong; ?>";
var userName = "<?php echo $userName; ?>";
var userZones = "<?php echo json_encode($userZones); ?>";
</script>
<div class="info">

</div>

</main>
</body>
</html>
