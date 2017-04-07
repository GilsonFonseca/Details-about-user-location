
var addressUser = document.getElementById("users_address");
var distance = document.getElementById("distance");
/* Gets the user's location and if fails return error message*/
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition);
} else { 
    addressUser.innerHTML = "Geolocation is not supported by this browser.";
}

/* 		This function gets the coordinates of the user, and handles it into a string. After that, it calls an url to 
	retrieve a JSON with the details of the user's address. Also, it passes the url to a new function that will
	handle it, and calls another function with a variable containing the coordinates as parameter, to calculate
	the distance between the user and a specified location. Lastly, initialize the map with a marker*/
function getPosition(position) {
	var latlng = position.coords.latitude +"," + position.coords.longitude;
	var myLatLng = {lat: position.coords.latitude, lng: position.coords.longitude};
	var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false"; 
	readAdressJSON(url);
	readDistanceJSON(latlng);
	
	initMap(myLatLng);

}
/* 		This function handle the JSON with the user's address. First, using jquery it retieves the JSON file into a variable data.
    After that it runs the data variable while the field results in JSON isn't over and get the information of formatted_address
	that is the detailed information about user's address, after doing that it set the addressUser tag with the info inside the variable address*/
function readAdressJSON(url){
	$.getJSON(url, function (data) { 
    for(var i=0;i<data.results.length;i++) 
    { 
        var address = data.results[i].formatted_address; 
       addressUser.innerHTML = 'Você está aqui: '+address; 
    }
	});
}

/* 		This function handle the JSON with the user's distance from the interest point. First, it calculate the distance using google's algorithm 
	for it. Setting the origins with the user's location and the destinations with the interest point, it also set the travel mode to driving and 
	the unit system to metric, and another minion things about traffic, highways and tolls. After that another function get the response and if it's status
	isn't ok return an error, otherwise set the distance tag with the info inside the variable address that is the distance.
	Here there's no need to run the JSON file cause the info that we want is in the root */
function readDistanceJSON(latlng){
     var distanceService = new google.maps.DistanceMatrixService();
     distanceService.getDistanceMatrix({
        origins: [latlng],
        destinations: ['-21.7725621,-43.3469667'],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        durationInTraffic: true,
        avoidHighways: false,
        avoidTolls: false
    },
    function (response, status) {
        if (status !== google.maps.DistanceMatrixStatus.OK) {
            console.log('Error:', status);
        } else {
			console.log(response);
            var adress = 'A distância a carro até '+ response.destinationAddresses +' é de \n'+response.rows[0].elements[0].distance.text; 
			distance.innerHTML = adress; 
        }
    });
}


/* 		This function initialize the map into the map div, zoomed at 14, and centered into user's location, also set the marker with it.*/
function initMap(myLatLng){
var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 14,
		center: myLatLng
	});

  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
	title: 'Hello World!'
  });
}

