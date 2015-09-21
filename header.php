<?php 
$currentPage = basename($_SERVER['PHP_SELF']);
if ($currentPage == "zoneinfo.php") {
    $formName = "z";
} elseif ($currentPage == "userinfo.php") {
    $formName = "u";
}
?>

<header>
<div class="header-content">
    <form>
    <input type="search" name="<?php echo $formName;?>" id="<?php echo $formName;?>" placeholder="Enter search term." value="" autofocus>
    <input type="submit" value="Search">
</form>
<nav class="nav-main">
<a href="zoneinfo.php">ZoneInfo</a>
<a href="userinfo.php">UserInfo</a>
</nav>
</div>
</header>
