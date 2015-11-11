	//GLOBALS
	var startLatitude = 37.6;
    var startLongitude = -95.665;	
    var map;
    
	var currentStep = -1;
	var stepTime = 2;	
	var pause = true;
	var playinterval;
	
	
	function showStorySteps(){
		var list = $("#mapinfo");
		$(".shareimg").click({trip_id:currentMapStory.id}, shareStory);
		for (var i=0; i< currentMapStory.travelSteps.length; i++) {
			var step = currentMapStory.travelSteps[i];
			addStoryStepToList(step, list);
			
			if (step instanceof TravelStop){
				var marker = new google.maps.Marker({
				    position: step.loc,
				    map: map,
				    title: step.title,
				    label: step.stopNumber.toString(),
				    color: "blue"
				    
				 });
			}
		}
	}
	
	function loadMap(){
		
		var myLatlng = new google.maps.LatLng(startLatitude,startLongitude);
		
		//Initiating the map    
		var myOptions = {
			zoom: 3,
			minZoom:2,
			maxZoom:17,
			center: myLatlng,
			//to disable street view
			keyboardShortcuts:false,
			streetViewControl: false,
			mapTypeControl: false,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			panControl: false
		}
    
		map = new google.maps.Map(document.getElementById("spotmap"),myOptions);
		
		google.maps.event.addListenerOnce(map, 'idle', function(){
			//map loaded fully
		});
		
	}
	
	function animateCircle(line, t_step) {
		$("#nextbut").prop("disabled",true);
		var count = 0;
		console.log(t_step);
		inter = window.setInterval(function() {
			count = (count + 1) % (stepTime*100);
			//console.log(count);
			if (count >= (stepTime*100) - 1){
				window.clearInterval(inter);
				var icons = line.get('icons');
				icons[0].offset = '100%';
				line.set('icons', icons);
				console.log(t_step);
				$("#nextbut").prop("disabled",false);
				endTravelStep(t_step);
			}
			else {
				var icons = line.get('icons');
				icons[0].offset = (count / stepTime) + '%';
				line.set('icons', icons);
			}
		}, 10);
	}
	
	
	function showPickedStep(event){
		showStoryStep(event.data.stepnumber);
	}
	
	function showNextTravelStep(){
		if ((currentStep + 1) >= currentMapStory.travelSteps.length){
			currentStep = -1;
		}
		currentStep = currentStep + 1;
		showStoryStep(currentStep);
	}
	
	function showStoryStep(stepnumber){
		console.log("stepnumber="+stepnumber);
		var t_step = currentMapStory.travelSteps[stepnumber];
		$("#title").html(t_step.title);
		$("#subtitle").html(t_step.description);	
		
		if (t_step instanceof TravelStop){
			var img = $("#stepimg");
			if(t_step.imgUrl && t_step.imgUrl != ""){
				var image = new Image();
				image.onload = function () {
				   //console.info("Image loaded !");
				   $("#imgdiv").show();
				}
				image.onerror = function () {
				   console.error("Cannot load image");
				   $("#imgdiv").hide();
				}
				image.src = t_step.imgUrl;
				img.attr("src",t_step.imgUrl);
				
			}
			else{
				$("#imgdiv").hide();
			}
		}
		else {
			$("#imgdiv").hide();
		}
		startTravelStep(t_step, false);
	}
	
	function startTravelStep(t_step, preview){
		//console.log(t_step);
		var center = map.getCenter();
		if (t_step instanceof TravelStop){
			//console.log("TravelStop");
			map.setZoom(t_step.getZoom());
			var bounds = map.getBounds();
			
			if (!bounds.contains(t_step.loc) || !bounds.contains(center)){
				bounds.extend(t_step.loc);
				bounds.extend(center);
				map.fitBounds(bounds);
			}
			
			map.panTo(t_step.loc);
			
		}
		else if (t_step instanceof TravelMove){
			//console.log("TravelMove");
			map.setZoom(18);
			
			var bounds = map.getBounds();
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
				//idnum: myLines.length,
				map: map
			});
			animateCircle(line,t_step);
		}
	}
	
	function endTravelStep(t_step){	
		var last_point = t_step.path[t_step.path.length-1];
		map.setCenter(last_point);
	}

	
	
	//VIEW EVENTS
	function onClickPreview(){
		showPreviewLineAndAnimation();
	}
	
	function onClickAddStep(){
		addStep();
	}
	
	function onClickNextbut(){
		showNextTravelStep();
	}
	
	function onClickPlayPause(){
		if (pause){
			pause = false;
			$("#playpause").html("Pause");
			playinterval = window.setInterval(function() {
				showNextTravelStep();
			}, 3000);
		}
		else {
			window.clearInterval(playinterval);
			pause = true;
			$("#playpause").html("Play");
		}
	}
	
	function mapLoaded(){
		loadMap();
		loadMapStory(tripID, jsonsteps);
		showStorySteps();	
	}
	
	function firstLoad(){
		//body loaded
	}	
	