	//GLOBALS
	var currentStep = null;
	var stepTime = 2;	
	var map;
	var geocoder;
	var startLatitude = 37.6;
    var startLongitude = -95.665;
	var geocodePair =[null,null,null];
	var places =[null,null,null];
	var placeLatLng;
	var newTstep = null;
	var myTrip = [];
	var myLines = [];
	var currentLine;
	var tripID = -1;
	var autocomplete;
	var autocomplete1;
	var autocomplete2;
	
	function showPan(latlng){
		var sv = new google.maps.StreetViewService();
		panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'));
		var svOptions = {
			panControl: false
		};
		panorama.setOptions(svOptions);
		var berkeley = latlng;
		sv.getPanorama({location: berkeley, radius: 50}, processSVData);
	}
	
	function processSVData(data, status) {
		if (status === google.maps.StreetViewStatus.OK) {
   
			panorama.setPano(data.location.pano);
			panorama.setPov({
				heading: 0,
				pitch: 0
			});
			panorama.setVisible(true);
			document.getElementById("pano").style.display = "block";
		} else {
			console.error('Street View data not found for this location.');
			document.getElementById("pano").style.display = "gone";
		}
	}
	
	function clearLines() {
		if(currentLine){
			currentLine.setMap(null);
		}
	}
	
	function showPickedStep(){
		
	}
	
	function showPreview(num){
		clearLines();
		if (num == 1){
			if (checkForMissingGeos(num)) return
			var title = $("#entersteptitle").val();
			var desc = $("#enterstepsubtitle").val();
			var url = $("#enterstepurl").val();
			var loc = geocodePair[0];
			var loc2 = geocodePair[1];
			var ttype = $('input[name="rbtnCount"]:checked').val();
			console.log(ttype);
			currentStep = new TravelMove(loc, loc2, "", ttype, 0, title, desc);
			if (geocodePair[0] == null) {
				geocodeAddress($('#startplace').val(),0);
			}
			if (geocodePair[1] == null) {
				geocodeAddress($('#endplace').val(),1);
			}
		}
		else if (num == 2){
			if (checkForMissingGeos(num)) return
			var title = $("#entersteptitle").val();
			var desc = $("#enterstepsubtitle").val();
			var url = $("#enterstepurl").val();
			var loc = geocodePair[2];
			currentStep = new TravelStop(loc, 0, title, desc, url, 0);
			if (geocodePair[2] == null) {
				geocodeAddress($('#placestop').val(),2);
			}
		}
		
		checkIfAllDone();
	}
	
	function checkForMissingTitle(){
		if ($('#entersteptitle').val() == ""){
			$('#entersteptitle').addClass("redborder");
			return true;
		}
		return false;
	}
	
	function checkForMissingGeos(num){
		if (num == 1){
			if ($('#startplace').val() == "" || $('#endplace').val() == ""){
				console.log("missing data stop 1");
				alert("You must provide a start and an end location");
				if ($('#startplace').val() == ""){
					$('#startplace').addClass("redborder");
				}
				else {
					$('#endplace').addClass("redborder");
				}
				return true;
			}
		}
		else if (num == 2){
			if ($('#placestop').val() == ""){
				console.log("missing data stop 2");
				$('#placestop').addClass("redborder");
				return true;
			}
		}
		return false;
		
	}
	
	function checkIfAllDone(){
		if (currentStep instanceof TravelStop){
			if (geocodePair[2] != null){
				startTravelStep(currentStep);
			}
		}
		else if (currentStep instanceof TravelMove){
			if (geocodePair[0] != null && geocodePair[1] != null){
				startTravelStep(currentStep);
			}
		}
	}
	
	function geocodeAddress(address, number) {
		geocoder.geocode({'address': address}, function(results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				console.log(results[0].geometry.location);
				geocodePair[number] = results[0].geometry.location;
				checkIfAllDone();
			} else {
				return null;
				console.log('Geocode was not successful for the following reason: ' + status);
			}
		});
	}
	

	
	function addTrip(){
		
		var maptitle = $("#entermaptitle").val();
		var mapdesc = $("#entermapsubtitle").val();
		var mapurl = $("#entermapimgurl").val();
		
		$.post('/addtrip',
			    {
					title: maptitle,
					desc: mapdesc,
					url: mapurl
			    })
			    .done(function(data) {
			    	tripID = data.toString();
			    	console.log(tripID);
			    	setCurrentMapStory(tripID, maptitle, mapdesc, null);
			    	showStoryInfo();
			    	loadTravelStepCreation();
			    }, "json");
	}
	
	function addTravelStop(){
		
		//validate input
		if (checkForMissingGeos(2)) return 
		if (checkForMissingTitle()) return
		
		var title = $("#entersteptitle").val();
		var desc = $("#enterstepsubtitle").val();
		var url = $("#enterstepurl").val();
		var loc = geocodePair[2];
		var ts = new TravelStop(loc, 0, title, desc, url, 0);
		var list = $("#steps");
		addStoryStepToList(ts, list);
		geocodePair =[null,null,null];
		
		$.post('/addtripstep',
			    {
					type: "2",
					tripid: tripID,
					title: ts.title,
					desc: ts.description,
					lat: ts.loc.lat(),
					lng: ts.loc.lng(),
					url: ts.imgUrl
			    })
			    .done(function(data) {
			    	console.log(data);
			    	loadTravelStepCreation();
			    }, "json");
	
	}

	
	function addTravelMove(){
		
		//validate input
		if (checkForMissingGeos(1)) return
		if (checkForMissingTitle()) return
		
		var title = $("#entersteptitle").val();
		var desc = $("#enterstepsubtitle").val();
		var url = $("#enterstepurl").val();
		var loc = geocodePair[0];
		var loc2 = geocodePair[1];
		var ttype = $('input[name="rbtnCount"]:checked').val();
		console.log(ttype);
		var ts = new TravelMove(loc, loc2, "", ttype, 0, title, desc)
		var list = $("#steps");
		addStoryStepToList(ts, list);
		geocodePair =[null,null,null];
		
		$.post('/addtripstep',
			    {
					type: "1",
					tripid: tripID,
					title: ts.title,
					desc: ts.description,
					lat: ts.startLoc.lat(),
					lng: ts.startLoc.lng(),
					lat2: ts.endLoc.lat(),
					lng2: ts.endLoc.lng(),
					traveltype: ts.travelType
			    })
			    .done(function(data) {
			    	console.log(data);
			    	loadTravelStepCreation();
			    }, "json");
	
	}
	
	function checkForLogin(){
		
		if (!loggedin){
			//ask user to login or go back
			console.log("not logged in");
			window.location = login_url;
		}
		else {
			initCreateMap()
		}
	}
	
	function initCreateMap(){
		var list = $("#blackcover");
		list.show();
		var div = $('<div>');
		div.attr("id","startupenter");
		div.addClass("initmapoptions");
		var p = $('<p>');
		p.html("Create a Map");
		
		var input = $('<input>');
		input.attr("type","text");
		input.attr("id","entermaptitle");
		input.attr("placeholder","Enter a title for your map");
		input.addClass("enterbasicmapinfo")
		
		var input2 = $('<input>');
		input2.attr("type","text");
		input2.attr("id","entermapsubtitle");
		input2.attr("placeholder","Enter a subtitle for your map");
		input2.addClass("enterbasicmapinfo")
		
		var input3 = $('<input>');
		input3.attr("type","text");
		input3.attr("id","entermapimgurl");
		input3.attr("placeholder","Enter a img link (cover photo)");
		input3.addClass("enterbasicmapinfo")
		
		var button = $('<button>');
		button.html("Create Map");
		button.click({},addTrip);
		
		//div.append(p);
		div.append(input);
		div.append(input2);
		div.append(input3);
		div.append(button);
		$( "body" ).append(div);
		
	}
	
	function addPhotoGallery(){
		$("#blackcover").show();
		
		var div = $('<div>');
		div.attr("id","photogal");
		
		var div2 = $('<div>');
		div2.addClass("gallerybox");
		
		
		var button = $('<button>');
		button.html("Cancel");
		
		div2.append(div);
		div2.append(button);
		
		$( "body" ).append(div2);
		$('#photogal').masonry({
			  // options
			  itemSelector: '.gallery',
			  columnWidth: 500
			});
	}
	
	function showTripMoveInput(){
		$("#addtostory").empty();
		$( "#addtostory" ).append( "<h3>Add To Story</h3>" );
		$( "#addtostory" ).append( "<input id='startplace' class='textinput' placeholder='Start Location (e.g. JFK Airport, NY)'></input >" );
		initAutocomplete('startplace', 0, "autocomplete");
		$( "#addtostory" ).append( "<input id='endplace' class='textinput' placeholder='End Location (e.g. SFO Airport, CA)'></input >" );
		initAutocomplete('endplace', 1, "autocomplete1");
		$( "#addtostory" ).append( "<span><b>Travel Type: </b></span><br/>" );
		$( "#addtostory" ).append( "<span>Plane</span>" );
		var radioBtn1 = $('<input class="rdio" type="radio" name="rbtnCount" value="plane" checked="true" />');
		var radioBtn2 = $('<input class="rdio" type="radio" name="rbtnCount" value="car" />');
		var radioBtn3 = $('<input class="rdio" type="radio" name="rbtnCount" value="train" />');
		var radioBtn4 = $('<input class="rdio" type="radio" name="rbtnCount" value="boat" />');
		
		$( "#addtostory" ).append(radioBtn1);
		$( "#addtostory" ).append( "<span>Car</span>" );
		$( "#addtostory" ).append(radioBtn2);
		$( "#addtostory" ).append( "<span>Train</span>" );
		$( "#addtostory" ).append(radioBtn3);
		$( "#addtostory" ).append( "<span>Boat</span>" );
		$( "#addtostory" ).append(radioBtn4);
		var input = $('<input>');
		input.attr("type","text");
		input.attr("id","entersteptitle");
		input.attr("placeholder","Enter a title");
		input.addClass("textinput")
		
		var input2 = $('<input>');
		input2.attr("type","text");
		input2.attr("id","enterstepsubtitle");
		input2.attr("placeholder","Enter a description");
		input2.addClass("textinput")
		
		
		
		$( "#addtostory" ).append(input);
		$( "#addtostory" ).append(input2);
		$( "#addtostory" ).append( "<button onclick='onClickPreview(1)'>Preview</button>" );
		$( "#addtostory" ).append( "<button onclick='addTravelMove()'>Add</button>" );
	
		$( "#startplace" ).focus(function() {
			$(this).removeClass("redborder")
			console.log($(this).val());
		});
		$( "#endplace" ).focus(function() {
			$(this).removeClass("redborder")
		});
		$( "#entersteptitle" ).focus(function() {
			$(this).removeClass("redborder")
		});
		
	}
	
		
	function showTripStopInput(){
		$("#addtostory").empty();
		$( "#addtostory" ).append( "<h3>Add To Story</h3>" );
		$( "#addtostory" ).append( "<input id='placestop' class='textinput' placeholder='Location'></input >" );
		initAutocomplete('placestop', 2,  "autocomplete2");
		var input = $('<input>');
		input.attr("type","text");
		input.attr("id","entersteptitle");
		input.attr("placeholder","Enter a title");
		input.addClass("textinput")
		
		var input2 = $('<input>');
		input2.attr("type","text");
		input2.attr("id","enterstepsubtitle");
		input2.attr("placeholder","Enter a description");
		input2.addClass("textinput")
		
		var input3 = $('<input>');
		input3.attr("type","url");
		input3.attr("id","enterstepurl");
		input3.attr("placeholder","Enter an image link");
		input3.addClass("textinput")
		
		$( "#addtostory" ).append(input);
		$( "#addtostory" ).append(input2);
		$( "#addtostory" ).append(input3);
		$( "#addtostory" ).append( "<button onclick='onClickPreview(2)'>Preview</button>" );
		$( "#addtostory" ).append( "<button onclick='addTravelStop()'>Add</button>" );
		
		$( "#placestop" ).focus(function() {
			$(this).removeClass("redborder")
			console.log($(this).val());
		});
		$( "#entersteptitle" ).focus(function() {
			$(this).removeClass("redborder")
		});
	}
	
	function initAutocomplete(docid, autoposition, autocomp) {
		
		//passing global var name
		window[autocomp] = new google.maps.places.Autocomplete(
			/** @type {!HTMLInputElement} */(document.getElementById(docid)),
			{});
		//types: ['geocode']
		window[autocomp].addListener('place_changed', function(){setAddress(autoposition)});
		//autocomplete = autocomps;
	}
	
	function fillInAddress() {
	}
	function setAddress(p){
		console.log(p);
		var place;
		if (p==0){
			places[0] = autocomplete.getPlace();
			place = places[0];
		}
		else if (p==1){
			places[1] = autocomplete1.getPlace();
			place = places[1]; 
			if (places[0] != null){
				var atitle = places[0].name +" to "+ places[1].name;
				$("#entersteptitle").val(atitle);
			}
		}
		else if (p==2){
			place = autocomplete2.getPlace();
			$("#entersteptitle").val(place.name);
			/*
			var photos = place.photos;
			
			if (!photos) {
				return;
			}
			else {
				addPhotoGallery();
				console.log(photos.length);
				for (var i=0; i < photos.length; i++){
					addPhoto(photos[i]);
				}
			}
			*/
			
		}
		if (place && place.geometry){
			geocodePair[p] = place.geometry.location;
			console.log("worked");
		}
		
	}
	
	function addPhoto(photo){
		var photos = $("#photogal");
		var higher, lower;
		if (photo.height > photo.width) {
			higher = photo.height;
			lower = photo.width;
		}
		else {
			higher = photo.width;
			lower = photo.height;
		}
		if ((lower/higher) > 0.5){
			var img = $('<img>');
			img.attr("src",photo.getUrl({'maxWidth': 300, 'maxHeight': 300}));
			img.addClass("gallery")
			photos.append(img);
		}
	}
	
	function showStoryInfo(){
		$("#titlearea").show();
		$("#title").html(currentMapStory.name);
		$("#subtitle").html(currentMapStory.desc)
		$(".shareimg").click({trip_id:currentMapStory.id}, shareStory);
	}
	
	function loadTravelStepCreation(){
		
		$("#blackcover").hide();
		$("#startupenter").hide();
		
		$("#create").show();
		$("#addtostory").empty();
		$( "#addtostory" ).append( "<button onclick='showTripMoveInput()'>Add Travel</button>" );
		$( "#addtostory" ).append( "<button onclick='showTripStopInput()'>Add Stop</button>" );
	}
	
	function loadMap(){
		
		geocoder = new google.maps.Geocoder();
		var myLatlng = new google.maps.LatLng(startLatitude,startLongitude);

		//Initiating the map    
		var myOptions = {
			zoom: 3,
			minZoom:2,
			maxZoom:17,
			center: myLatlng,
			//to disable street view
			keyboardShortcuts:true,
			streetViewControl: false,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			//styles: styleArray,
			panControl: false
		}
    
		map = new google.maps.Map(document.getElementById("spotmap"),myOptions);
		var places = new google.maps.places.PlacesService(map);
		google.maps.event.addListenerOnce(map, 'idle', function(){
			//map loaded fully
		});
		
	}
	
	function animateCircle(line,t_step) {
		var count = 0;
		console.log(t_step);
		inter = window.setInterval(function() {
			count = (count + 1) % (stepTime*100);
			if (count >= (stepTime*100) - 1){
				window.clearInterval(inter);
				var icons = line.get('icons');
				icons[0].offset = '100%';
				line.set('icons', icons);
				console.log(t_step);
				endTravelStep(t_step);
			}
			else {
				var icons = line.get('icons');
				icons[0].offset = (count / stepTime) + '%';
				line.set('icons', icons);
			}
		}, 10);
	}
		
	function endTravelStep(t_step){
		
		var last_point = t_step.path[t_step.path.length-1];
		map.setCenter(last_point);
		map.setZoom(10);
		
	}
	
	function startTravelStep(t_step){
		console.log(t_step);
		if (t_step instanceof TravelStop){
			console.log("tree");
			var marker = new google.maps.Marker({
			    position: t_step.loc,
			    map: map,
			    title: t_step.title,
			    color: "blue" 
			  });
			
			map.panTo(t_step.loc);
			map.setZoom(t_step.getZoom());
		}
		else if (t_step instanceof TravelMove){
			console.log("TravelMove");
			map.setZoom(t_step.getZoom());
			
			var bounds = map.getBounds();
			console.log(t_step.path[0]);
			map.setCenter(t_step.getMidPoint());
			if (!bounds.contains(t_step.startLoc) || !bounds.contains(t_step.endLoc)){
				bounds.extend(t_step.startLoc);
				bounds.extend(t_step.endLoc);
				map.fitBounds(bounds);
			}
			
			var scolor = 'blue';
			var geod = true;
			if (t_step.travelType != 'plane'){
				 scolor = 'green';
				 geod = false;
			}
			var line = new google.maps.Polyline({
				path: t_step.path,
				icons: [{
					icon: t_step.getLineSymbol(),
					fixedRotation:t_step.getFixedSymbol(),
					rotation:t_step.getSymbolRotation()
				}],
				strokeColor: scolor,
				strokeOpacity :0.0,
				geodesic:geod,
				zIndex: 1000,
				idnum: myLines.length,
				map: map
			});
			//myLines.push(line);
			currentLine = line;
			animateCircle(line,t_step);
		}
	}
	
	
	
	//VIEW EVENTS
	function onClickPreview(num){
		showPreview(num);
	}
	function onClickAddStep(){
		addStep();
	}
	function mapLoaded(){
		loadMap();
		checkForLogin();
		//initCreateMap();
	}	