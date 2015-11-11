var trips = [];
var currentMapStory;
function setCurrentMapStory(tripid, name, subtitle, travelsteps){
	currentMapStory = {
		id: tripid,
		name: name,
		desc: subtitle,
		travelSteps: travelsteps
	};	
}

function setCurrentMapStoryName(name){
	currentMapStory.name = name;
}

function loadTrips(){
	downloadJSONUrl('/gettrips', function(data){ parseTrips(data); });
}
function loadMyTrips(){
	downloadJSONUrl('/gettrips?p=y', function(data){ parseTrips(data); });
}

function parseTrips(data){
	for (var i = 0; i < data.length; i++) {
		//console.log(data[i].trip_name);
		//console.log("|"+data[i].trip_img_url+"|");
		//if(!data[i].trip_img_url) continue;
		var loc = new google.maps.LatLng(eval(data[i].center_loc.latitude),
				eval(data[i].center_loc.longitude));
		trips.push(new Trip(data[i].id, data[i].trip_name, data[i].trip_subtitle, 
				data[i].trip_img_url, loc));
	}
	showTrips();
}

function loadMapStory(tripid, jsonstory){
	var travelsteps = [];
	var stopnumber = 0;
	for (var i=0; i<jsonstory.length; i++) {
		var step = jsonstory[i];
		//var first_point = t_step.path[0];
		//var last_point = t_step.path[t_step.path.length-1];
		if(step.hasOwnProperty("end_loc")){
			var start = new google.maps.LatLng(eval(step.start_loc.latitude),
				eval(step.start_loc.longitude));
			var end = new google.maps.LatLng(eval(step.end_loc.latitude),
				eval(step.end_loc.longitude));
			if (!step.path || step.path == ""){
				step.path = [start, end];
			}
		
			travelsteps.push(new TravelMove(start, end, step.path, 
				step.travel_type, step.stepnumber, step.title, step.description));
			//console.log(step.description);
			//console.log(step);
		}
		else {
			var loc = new google.maps.LatLng(eval(step.loc.latitude),
					eval(step.loc.longitude));
			stopnumber +=1;
			travelsteps.push(new TravelStop(loc, step.stepnumber, step.title,
					step.description, step.img_url,stopnumber));
			console.log(step.description);
			console.log(step);
			console.log(travelsteps);
					
		}
	}
	
	setCurrentMapStory(tripid, "blank", "blank", travelsteps);
	
}

//Trip Class
	function Trip(tripid, title, description, image, center) {
		this.tripID = tripid;
		this.title = title;
		this.description = description;
		this.image = image;
		this.center = center;
	}

//TravelMove Class
	//constructor
	function TravelMove(startloc, endloc, path, traveltype, stepnumber, title, description) {
		this.startLoc = startloc;
		this.endLoc = endloc;
		this.path = path;
		this.travelType = traveltype;
		this.stepNumber = stepnumber;
		this.title = title;
		this.description = description;
		//this.when = when;
		if (!this.path || this.path == ""){
			this.path = [this.startLoc, this.endLoc];
		}
	}
	
	
	//functions
	TravelMove.prototype.getLineSymbol = function() {
		console.log(this.travelType);
		var svg_path;
		var p;
		var s;
		var fr = false;
		if (this.travelType == 'plane'){
			svg_path = 'M362.985,430.724l-10.248,51.234l62.332,57.969l-3.293,26.145 l-71.345-23.599l-2.001,13.069l-2.057-13.529l-71.278,22.928l-5.762-23.984l64.097-59.271l-8.913-51.359l0.858-114.43 l-21.945-11.338l-189.358,88.76l-1.18-32.262l213.344-180.08l0.875-107.436l7.973-32.005l7.642-12.054l7.377-3.958l9.238,3.65 l6.367,14.925l7.369,30.363v106.375l211.592,182.082l-1.496,32.247l-188.479-90.61l-21.616,10.087l-0.094,115.684';
			p = new google.maps.Point(300, 300);
			s = 0.04;
		}
		else if (this.travelType == 'train'){
			svg_path = 'M 244.61,368.146 C 267.622,364.437 290.529,340.437 290.529,311.187 L 290.529,97.33 C 290.529,67.138 265.13,39.424 230.622,39.424 L 83,39.424 C 48.493,39.424 23.093,67.138 23.093,97.33 L 23.093,311.187 C 23.093,340.437 46,364.437 69.012,368.146 L 0,471.664 39.816,471.664 89.179,399.297 224.443,399.297 273.806,471.664 313.621,471.664 244.61,368.146 z M 117.934,61.438 C 117.934,56.188 122.5,51.778 127.75,51.778 L 185.872,51.778 C 191.122,51.778 195.688,56.188 195.688,61.438 L 195.688,78.438 C 195.688,83.688 191.372,88.201 185.872,88.201 L 127.75,88.201 C 122.25,88.201 117.934,83.688 117.934,78.438 L 117.934,61.438 z M 55.152,129.688 C 55.152,113.688 65.5,99.726 85,99.726 L 228.622,99.726 C 248.122,99.726 258.471,113.688 258.471,129.688 L 258.471,168.188 C 258.622,186.688 245.122,198.014 228.622,198.014 L 85,198.014 C 68.5,198.014 55,186.688 55.152,168.188 L 55.152,129.688 z M 81.75,336.951 C 67.245,336.951 55.487,325.191 55.487,310.687 55.487,296.183 67.245,284.424 81.75,284.424 96.255,284.424 108.013,296.183 108.013,310.687 108.013,325.191 96.255,336.951 81.75,336.951 z M 205,310.688 C 205,296.184 216.758,284.425 231.263,284.425 245.768,284.425 257.526,296.184 257.526,310.688 257.526,325.192 245.768,336.952 231.263,336.952 216.758,336.952 205,325.191 205,310.688 z M 195.446,16.591999 C 195.446,25.755507 188.01751,33.183998 178.854,33.183998 169.6905,33.183998 162.262,25.755507 162.262,16.591999 162.262,7.428491 169.6905,0 178.854,0 188.01751,0 195.446,7.428491 195.446,16.591999 z M 151.36,16.591999 C 151.36,25.755507 143.93151,33.183998 134.76801,33.183998 125.6045,33.183998 118.17601,25.755507 118.17601,16.591999 118.17601,7.428491 125.6045,0 134.76801,0 143.93151,0 151.36,7.428491 151.36,16.591999 z';
			p = new google.maps.Point(100, 100);
			s = 0.06;
		}
		else if (this.travelType == 'boat'){
			svg_path = 'M 11.3,274.7 H 98.7 L 108.7,254.6 H 459.6 L 470.1,274.7 H 488.7 V 345.2 A 100,100 0 0 1 369.4,345.2 A 100,100 0 0 1 250.1,345.2 A 100,100 0 0 1 130.8,345.2 A 100,100 0 0 1 68.3,365.3 Z M 227,113.4 H 236.9 L 230.4,134 H 246.8 V 148.1 H 225.9 L 192.3,254.6 H 147.9 Z M 137.3,196.3 H 210.2 L 227,214.3 H 348.6 L 376.7,164.2 H 416.4 V 214.3 H 438.6 L 449.1,234.5 H 118.5 Z';
			
			p = new google.maps.Point(100, 100);
			s = 0.06;
		}
		else {
			//car
			svg_path = 'M -53.582954,-415.35856 C -67.309015,-415.84417 -79.137232,-411.40275 -86.431515,-395.45159 L -112.76807,-329.50717 C -131.95714,-324.21675 -140.31066,-310.27864 -140.75323,-298.84302 L -140.75323,-212.49705 L -115.44706,-212.49705 L -115.44706,-183.44029 C -116.67339,-155.74786 -71.290042,-154.67757 -70.275134,-183.7288 L -69.739335,-212.24976 L 94.421043,-212.24976 L 94.956841,-183.7288 C 95.971739,-154.67759 141.39631,-155.74786 140.16998,-183.44029 L 140.16998,-212.49705 L 165.43493,-212.49705 L 165.43493,-298.84302 C 164.99236,-310.27864 156.63886,-324.21677 137.44977,-329.50717 L 111.11322,-395.45159 C 103.81894,-411.40272 91.990714,-415.84414 78.264661,-415.35856 L -53.582954,-415.35856 z M -50.57424,-392.48409 C -49.426163,-392.49037 -48.215854,-392.45144 -46.988512,-392.40166 L 72.082372,-392.03072 C 82.980293,-392.28497 87.602258,-392.03039 92.236634,-381.7269 L 111.19565,-330.61998 L -86.30787,-330.86727 L -67.554927,-380.61409 C -64.630656,-390.57231 -58.610776,-392.44013 -50.57424,-392.48409 z M -92.036791,-305.02531 C -80.233147,-305.02529 -70.646071,-295.47944 -70.646071,-283.6758 C -70.646071,-271.87217 -80.233147,-262.28508 -92.036791,-262.28508 C -103.84043,-262.28508 -113.42751,-271.87216 -113.42751,-283.6758 C -113.42751,-295.47946 -103.84043,-305.02531 -92.036791,-305.02531 z M 117.91374,-305.02531 C 129.71738,-305.02533 139.26324,-295.47944 139.26324,-283.6758 C 139.26324,-271.87216 129.71738,-262.28508 117.91374,-262.28508 C 106.1101,-262.28507 96.523021,-271.87216 96.523021,-283.6758 C 96.523021,-295.47944 106.1101,-305.02531 117.91374,-305.02531 z M 103.2216,-333.14394 L 103.2216,-333.14394 z M 103.2216,-333.14394 C 103.11577,-333.93673 102.96963,-334.55679 102.80176,-335.21316 C 101.69663,-339.53416 100.2179,-342.16153 97.043938,-345.3793 C 93.958208,-348.50762 90.488134,-350.42644 86.42796,-351.28706 C 82.4419,-352.13197 45.472822,-352.13422 41.474993,-351.28706 C 33.885682,-349.67886 27.380491,-343.34759 25.371094,-335.633 C 25.286417,-335.3079 25.200722,-334.40363 25.131185,-333.2339 L 103.2216,-333.14394 z M 64.176391,-389.01277 C 58.091423,-389.00227 52.013792,-385.83757 48.882186,-379.47638 C 47.628229,-376.92924 47.532697,-376.52293 47.532697,-372.24912 C 47.532697,-368.02543 47.619523,-367.53023 48.822209,-364.99187 C 50.995125,-360.40581 54.081354,-357.67937 59.048334,-355.90531 C 60.598733,-355.35157 62.040853,-355.17797 64.86613,-355.27555 C 68.233081,-355.39187 68.925861,-355.58211 71.703539,-356.95492 C 75.281118,-358.72306 77.90719,-361.35074 79.680517,-364.96188 C 80.736152,-367.11156 80.820083,-367.68829 80.820085,-372.0392 C 80.820081,-376.56329 80.765213,-376.87662 79.470596,-379.50637 C 76.3443,-385.85678 70.261355,-389.02327 64.176391,-389.01277 z';
			p = new google.maps.Point(-300, -300);
			s = 0.06;
		}
		console.log("adddd3333ds");
		var line_symbol = {
			path: svg_path,
			scale: s, 
			strokeOpacity: 0.0,
			strokeColor:'purple',
			fillColor: 'red',
			fillOpacity:0.5,
			strokeWeight: 1,
			anchor:p
		};
		return line_symbol;
	};
	
	TravelMove.prototype.getFixedSymbol = function() {
		if (this.travelType == 'plane'){
			return false;
		}
		else if (this.travelType == 'train'){
			return true;
		}
		else if (this.travelType == 'boat'){
			return true;
		}
		else {
			return true;
		}
		
	};
	TravelMove.prototype.getSymbolRotation = function() {
		if (this.travelType == 'plane'){
			return 0;
		}
		else if (this.travelType == 'train'){
			return 180;
		}
		else if (this.travelType == 'boat'){
			return 180;
		}
		else {
			return 180;
		}
		
	};
	
	TravelMove.prototype.getZoom = function() {
		if (this.travelType == 'plane'){
			return 5;
		}
		else {
			return 19;
		}
	}
	
	TravelMove.prototype.setDescriptionFromPoints = function(start, end) {
		if (this.travelType == 'plane'){
			this.description = "Flight from "+ start + " to " + end;
		}
		else {
			this.description = "Drive from "+ start + " to " + end;
		}
	}
	
	TravelMove.prototype.getMidPoint = function() {
		return (new google.maps.LatLng(
				  ((this.startLoc.lat() + this.endLoc.lat()) / 2.0),
				  ((this.startLoc.lng() + this.endLoc.lng()) / 2.0)
				));
	}
	
	
//TravelStop Class
	//constructor
	function TravelStop(loc, stepnumber, title, description, imgurl, stopnumber) {
		this.loc = loc;
		this.stepNumber = stepnumber;
		this.title = title;
		this.description = description;
		this.imgUrl = imgurl;
		this.stopNumber = stopnumber;
		//this.when = when;
	}
	
	
	//functions
	TravelStop.prototype.getZoom = function() {
		return 17;
	}

	TravelStop.prototype.getMidPoint = function(latlng) {
		return (new google.maps.LatLng(
				  ((this.loc.lat() + latlng.lat()) / 2.0),
				  ((this.loc.lng() + latlng.lng()) / 2.0)
				));
	}