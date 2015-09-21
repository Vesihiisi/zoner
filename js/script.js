$(document).ready(function() {

populateMap();

map.on('moveend', function() {
    console.log("re-populating map");
    populateMap();
})

});
