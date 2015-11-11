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
<meta name="keywords" CONTENT="Trip" />
<meta name="description" CONTENT="Trip" />
<title>Create Map</title>

<link type="text/css" rel="stylesheet" href="./css/main.css"/>
<link type="text/css" rel="stylesheet" href="./css/createmap.css"/>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/masonry/3.3.2/masonry.pkgd.min.js"></script>
<script type="text/javascript" src="./js/model.js"></script>
<script type="text/javascript" src="./js/generalController.js"></script>
<script type="text/javascript" src="./js/createmapController.js"></script>
<script async defer type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=visualization,geometry,places&sensor=false&callback=mapLoaded"></script>
</head>
<body>
	<%
    	UserService userService = UserServiceFactory.getUserService();
    	User user = userService.getCurrentUser();
    	String login_url = userService.createLoginURL(request.getRequestURI());	
    	pageContext.setAttribute("login_url", login_url);
    	boolean loggedin = false;
    	if (user != null) {
    		loggedin = true;
    	}
    %>
    <div id="blackcover"></div>
    <div id="titlearea" style="display:none;">
		<img class="shareimg" src="../images/share.png" />
		<h2 id="title"></h2>
		<p id="subtitle"></p>	
	</div>	
	<div id="spotmap"></div>
	<div id="create">
		<div id="addtostory"></div>
		<div id="steps"><h3>Steps</h3></div>
	</div>
	<script type="text/javascript">  
		var loggedin = <%= loggedin %>;
		var login_url = "${login_url}";
	</script>
</body>
</html>