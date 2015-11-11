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
		                	    "featureType": "water",
		                	    "stylers": [
		                	      { "color": "#babcbb" }
		                	    ]
		                	  },{
		                	    "featureType": "landscape",
		                	    "stylers": [
		                	      { "color": "#a08290" }
		                	    ]
		                	  }
		                	  ,{
			                	    "featureType": "road",
			                	    "stylers": [
			                	      { "color": "#a08290" }
			                	    ]
			                	  },{
		                		  "featureType": "poi",
			                	    "stylers": [
			                	      { "color": "#a08290" }
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
		
		$( "#stories" ).append( "<h2>Featured Map Stories</h2>" );
		var list = $("#stories").append('<ul class="stories"></ul>').find('ul');
		var randomarray = getRandomNums(trips.length, 3);
		for (var i = 0; i < trips.length; i++) {
			console.log(randomarray.indexOf(i));
			if (randomarray.indexOf(i) != -1){
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
			}
			addMarker(trips[i], map);
		}
		$( "#stories" ).show();
	}
	
	
	//VIEW EVENTS
	function firstLoad(){
		loadMap();
		loadTrips();
	}