package com.webapps.mapstory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;

/**

 */
public class GetTripsServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String personal = request.getParameter("p");;
		if (personal != null && personal.equalsIgnoreCase("y")){
			
			UserService userService = UserServiceFactory.getUserService();
		    User user = userService.getCurrentUser();  // Find out who the user is.
			
			//filter for user email
			List<Trip> trs =  ObjectifyService.ofy().load()
					.type(Trip.class)
					.filter("user_id =", user.getUserId())
					.list();
			List<Trip> tfilt = new ArrayList<Trip>();
			for (Trip t:trs){
				t.user_id = "";
				tfilt.add(t);
			}
		    String json = new Gson().toJson(tfilt);
	
		    response.setContentType("application/json");
		    response.setCharacterEncoding("UTF-8");
		    response.getWriter().write(json);
		}
		else {
			List<Trip> trs =  ObjectifyService.ofy().load()
					.type(Trip.class)
					.filter("trip_img_url !=", "")
					.list();
			List<Trip> tfilt = new ArrayList<Trip>();
			for (Trip t:trs){
				if (t.center_loc != null){
					t.user_id = "";
					tfilt.add(t);
				}
			}
		    String json = new Gson().toJson(tfilt);
	
		    response.setContentType("application/json");
		    response.setCharacterEncoding("UTF-8");
		    response.getWriter().write(json);
		}
	}
  
}