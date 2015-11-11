<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@ page import="com.webapps.mapstory.Trip" %>
<%@ page import="com.webapps.mapstory.TravelStep" %>
<%@ page import="com.webapps.mapstory.TravelMove" %>
<%@ page import="com.webapps.mapstory.TravelStop" %>
<%@ page import="com.googlecode.objectify.Key" %>
<%@ page import="com.googlecode.objectify.ObjectifyService" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.gson.Gson" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
	Long trip_id = Long.parseLong(request.getParameter("story"));
  	Trip t = ObjectifyService.ofy()
          .load()
          .type(Trip.class) // We want only Trips
          .id(trip_id)
          .now();
          
  	pageContext.setAttribute("trip_name", t.trip_name);
  	pageContext.setAttribute("trip_desc", t.trip_subtitle);
  	pageContext.setAttribute("trip_img", t.trip_img_url);
  	
%>

<!DOCTYPE html">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" CONTENT="Trip" />
<meta name="description" CONTENT="Stories on maps" />
<title>View a Story</title>

<link type="text/css" rel="stylesheet" href="./css/main.css"/>
<link type="text/css" rel="stylesheet" href="./css/viewmap.css"/>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="./js/model.js"></script>
<script type="text/javascript" src="./js/generalController.js"></script>
<script type="text/javascript" src="./js/viewmapController.js"></script>
<script async defer type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=visualization,geometry,places&sensor=false&callback=mapLoaded"></script>


</head>
<body onload="firstLoad()">
	<div id="blackcover"></div>
	<div id="titlearea">
		<img class="shareimg" src="../images/share.png" />
		<h2 id="title">${fn:escapeXml(trip_name)}</h2>
		<p id="subtitle">${fn:escapeXml(trip_desc)}</p>	
	</div>
	<div id="tripsteps">
		<div id="mapinfo">
			<%
				List<TravelStep> travelsteps = ObjectifyService.ofy()
		          .load()
		          .type(TravelStep.class) 
		          .ancestor(t)
		          .order("stepnumber")       // order by stepnumber ASC
		          .list();
	         	String jsonsteps = new Gson().toJson(travelsteps);
			%>
		</div>
	</div>
    <div id="imgdiv">
    	<img id="stepimg" src=${fn:escapeXml(trip_img)} />
    </div>
	<div id="spotmap"></div>
	<div id="controls">
		<button id="playpause" onclick="onClickPlayPause()">Play</button>
		<button id="nextbut" onclick="onClickNextbut()">Next</button>
	</div>
	<script type="text/javascript">  
		var jsonsteps = <%= jsonsteps %>;
		var tripID = <%= trip_id %>;
	</script>
	
</body>
</html>