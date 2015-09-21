<?php 
$currentPage = basename($_SERVER['PHP_SELF']);
if ($currentPage == "zoneinfo.php") {
    $formName = "z";
} elseif ($currentPage == "userinfo.php") {
    $formName = "u";
}

function highlightNavbar($uri)
{
    if ($uri == basename(strtok($_SERVER["REQUEST_URI"], '?'))) {
        return "class=here";
    }
}

?>

<header>
<div class="header-content">
    <form>
    <input type="search" name="<?php echo $formName;?>" id="<?php echo $formName;?>" placeholder="Enter search term." value="" autofocus>
    <input type="submit" value="Search">
</form>
<nav class="nav-main">
<a <?= highlightNavbar("zoneinfo.php"); ?> href="zoneinfo.php">ZoneInfo</a>
<a <?= highlightNavbar("userinfo.php"); ?> href="userinfo.php">UserInfo</a>
</nav>
</div>
</header>
