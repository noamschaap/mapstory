<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="java.util.List" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<!DOCTYPE html">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="keywords" CONTENT="Map, Story" />
<meta name="description" CONTENT="Stories on maps" />
<title>Map Story</title>

<link type="text/css" rel="stylesheet" href="./css/main.css"/>
<link type="text/css" rel="stylesheet" href="./css/startpage.css"/>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=visualization,geometry&sensor=false"></script>
<script type="text/javascript" src="./js/model.js"></script>
<script type="text/javascript" src="./js/generalController.js"></script>
<script type="text/javascript" src="./js/richmarker.js"></script>
<script type="text/javascript" src="./js/startpageController.js"></script>

</head>
<body onload="firstLoad()">
	<div id="blackcover"></div>
	<div id="mymapslink">
	<%
    	UserService userService = UserServiceFactory.getUserService();
    	User user = userService.getCurrentUser();
    	String login_url = userService.createLoginURL(request.getRequestURI());	
    	if (user != null) {
    %>	
			<a href="/mymaps">My Maps</a>	
	<%
		}
		else {
	%>
			<a href="<%= userService.createLoginURL(request.getRequestURI()) %>">Sign in</a>
	<%
		}	
	%>
	</div>	
			
	<div id="stories"></div>
    <div id="spotmap"></div>	
	<div id="greycover"></div>	
 	<div id="options">
 		<button id="createstorybut" onclick="createStory()">Create your own Map Story</button>
	</div>
	
</body>
</html>