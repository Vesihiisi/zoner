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
<script src="js/script.js"></script>
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
</script>
<div class="info">
<p class="breadcrumb"><?php echo "$country >> $regionName"?></p>
<p><span class="zoneName"><?php echo $zoneName?></span> (<?php echo $takeoverPoints?>, +<?php echo $pph?>)
<a href='#' onclick='location.reload(true); return false;'>refresh</a>
</p>
<p><span class="ownerName"><a href="<?php echo $ownerUrl?>"><?php echo $ownerName?></a></span>
<span class="ownerInfo">(lvl <?php echo $ownerLevel?>, owns <?php echo $ownerOwns?>)</span>
</p>
<p><?php echo $timeTaken?><?php echo $canBeTakenIndicator?>
</p>

</div>
</main>
</body>
</html>
