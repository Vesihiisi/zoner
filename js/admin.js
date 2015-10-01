$(document).ready(function() {

    function getNoOfZones() {
        $(".noOfZones").html("please wait....")
        $.get("getNoOfZones.php", function(data) {
            $(".noOfZones").html(data)
        })
    }

    function getDbLength() {
        $(".noOfZonesDb").html("please wait....")
        $.get("getDbLength.php", function(data) {
            $(".noOfZonesDb").html(data)
        })
    }

    function addNewZones() {
        $(".addNewInfo").html("please wait....")
        $.get("addNewZones.php", function() {
            $(".addNewInfo").html("done")
        })
    }

    function updateZones() {
        $(".updateZones").html("please wait....")
        $.get("updateZones.php", function() {
            $(".updateZones").html("done")
        })
    }

    $("#getNo").click(function() {
        getNoOfZones();
    })

    $("#getNoDb").click(function() {
        getDbLength();
    })

    $("#addNew").click(function() {
        addNewZones();
    })

    $("#updateZones").click(function() {
        updateZones();
    })

});
