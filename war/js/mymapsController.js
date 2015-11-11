	//GLOBALS
	var map;
	var startLatitude = 37.6;
    var startLongitude = -95.665;
    var infowindow;
	
	function loadMap(){
		
		var myLatlng = new google.maps.LatLng(startLatitude,startLongitude);
		
		//Styling the map    
		var styleArray = [	  
			
			{
				featureType: "landscape",
				elementType: "geometry.fill",
				stylers: [
					{ color: "#d3d3d3" }
				]
			} ,
			{
				featureType: "poi",
				elementType: "geometry",
				stylers: [
					{ visibility: "off" }
				]
			}			  
		];


		//Initiating the map    
		var myOptions = {
			zoom: 2,
			minZoom:2,
			maxZoom:16,
			center: myLatlng,
			//to disable street view
			keyboardShortcuts:true,
			streetViewControl: false,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: styleArray,
			panControl: false
		}
    
		map = new google.maps.Map(document.getElementById("spotmap"),myOptions);
		
		google.maps.event.addListenerOnce(map, 'idle', function(){
			//when loaded fully
		});
		
		infowindow = new google.maps.InfoWindow();
		
	}
	
	function showTrips(){
		
		$( "#stories" ).append( "<h2>My Map Stories</h2>" );
		var list = $("#stories").append('<ul class="stories"></ul>').find('ul');
		for (var i = 0; i < trips.length; i++) {
			var li = $('<li>');
			li.addClass("navli");
			li.click({trip_id:trips[i].tripID},requestStoryMap);
			var img = $('<img>');
			img.attr("src",trips[i].image);
			img.addClass("tripimg");
			var h3 = $('<h3>');
			h3.html(trips[i].title)
			var p = $('<p>');
			p.html(trips[i].description);
			li.append(img);
			li.append(h3);
			li.append(p);
			list.append(li);
			
			addMarker(trips[i], map);
		}
		$( "#stories" ).show();
	}
	
	//View Events
	function firstLoad(){
		loadMap();
		loadMyTrips();
	}