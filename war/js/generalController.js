function createStory(){
	location.href = "/createmap";
}
function shareStory(event){
	$("#blackcover").show();
	var tripid = event.data.trip_id.toString();
	//console.log(tripid);
	
	var div = $('<div>');
	div.attr("id","centerdiv")
	div.addClass("centerdiv");
	var p = $('<h3>');
	p.html("Share a link");
	var p2 = $('<p>');
	p2.html("Here is the link for this map story:");
	var p3 = $('<textarea>');
	p3.attr('readonly', true);
	p3.addClass("storylink");
	p3.val("mapstory-1113.appspot.com/viewmap.jsp?story="+tripid);
		
	var button = $('<button>');
	button.html("OK");
	button.click({},closeShare);
		
	div.append(p);
	div.append(p2);
	div.append(p3);
	div.append(button);
	$( "body" ).append(div);
			
}

function closeShare(){
	$("#blackcover").hide();
	$("#centerdiv").remove();
}

function requestStoryMap(event){
		var tripid = event.data.trip_id.toString();
		//console.log(tripid);
		window.location = "viewmap.jsp?story="+tripid;	
}

function addStoryStepToList(step, list){
	
	if (step instanceof TravelStop){
		var div = $('<div>');
		div.addClass("travel_stop");
		
		var p = $('<p>');
		p.addClass("travelstop_header");
		p.html(step.title);
		var p2 = $('<p>');
		p2.addClass("travelstop_body");
		p2.html(step.description);
		
		if(step.imgUrl && step.imgUrl != ""){
			var img = $('<img>');
			img.attr("src",step.imgUrl);
			img.addClass("travel_stop_img");
		
			div.append(img);
		}
		div.append(p)
		div.append(p2)
		div.click({stepnumber:step.stepNumber},showPickedStep);
		list.append(div);
	}
	else if (step instanceof TravelMove){
		var span = $('<span>');
		span.html(step.title);
		span.addClass("travel_move");
		list.append(span);
	}
	
}

function addMarker(atrip, mapobj){
	var trip = atrip;
	var marker = new RichMarker({
          position:trip.center,
          shadow: 'none',
          map: mapobj,
          draggable: false,
          content: '<div id="markerdiv"><img class="markerimage" src="' +trip.image+'" /></div>'
	});
	marker.addListener('click', function() {
		var amarker = marker;
		var atrip = trip;
		addLineClickListener(amarker,atrip, infowindow, map);
	});
}

function addLineClickListener(marker, trip, infowindowobj, mapobj){
	
	console.log(marker.position.lat());
	//var content = '<div class="infowindow"> <p>'+data.trip_name +'</p>'
	//	+'<img class="infowindowmarkerimage" src="' +data.trip_img_url+'" /></div>';
	
	var infodiv = $('<div>');
	infodiv.addClass("infowindow");
	var img = $('<img>');
	img.attr("src",trip.image);
	img.addClass("infowindowmarkerimage");
	
	var h3 = $('<h3>');
	h3.html(trip.title);
	var p2 = $('<p>');
	p2.html(trip.description);
	var p3 = $('<p>');
	p3.html("View Story");
	p3.addClass("linkp");
	p3.click({trip_id:trip.tripID},requestStoryMap);
	/*
	var shareimg = $('<img>');
	shareimg.attr("src","../images/share.png");
	shareimg.addClass("shareimg");*/
	var p4 = $('<p>');
	p4.html("Share Story");
	p4.addClass("linkp");
	p4.click({trip_id:trip.tripID},shareStory);
	infodiv.append(img);
	infodiv.append(h3);
	infodiv.append(p2);
	infodiv.append(p3);
	infodiv.append(p4);
	//console.log(infodiv[0]);
	infowindowobj.setContent(infodiv[0]);
	infowindowobj.setPosition(marker.position);
	infowindowobj.open(mapobj);
}

//General Functions
function commaRound(x){
	return numberWithCommas(Math.round(x));
}
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* [0,1,2] size is 3 amount 3*/
function getRandomNums(size, amount){
	var arr = [];
	for (var i=0; i < size; i++){
		arr[i] = i;
	}
	if (amount >= size){
		return arr;
	}
	var arr2 = shuffle(arr);
	return arr2.slice(0, amount);
}
function shuffle(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex ;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
}
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function downloadJSONUrl(url, callback) {
	$.getJSON(url, callback);
}