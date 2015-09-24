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
<span class="logo"><h1>.</h1></span>
    <form>
    <input type="text" name="<?php echo $formName;?>" id="<?php echo $formName;?>" placeholder="Enter search term." value="" autofocus>
    <input type="submit" value="Search">
</form>
</div>
</header>
