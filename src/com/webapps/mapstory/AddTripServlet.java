package com.webapps.mapstory;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.googlecode.objectify.ObjectifyService;

/**
 * Form Handling Servlet
 * Most of the action for this sample is in webapp/guestbook.jsp, which displays the
 * {@link Greeting}'s. This servlet has one method
 * {@link #doPost(<#HttpServletRequest req#>, <#HttpServletResponse resp#>)} which takes the form
 * data and saves it.
 */
public class AddTripServlet extends HttpServlet {

  // Process the http POST of the form
  @Override
  public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {


    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();  // Find out who the user is.

    String trip_name = req.getParameter("title");
    String desc = req.getParameter("desc");
    String url = req.getParameter("url");
    //String tripUrl = req.getParameter("tripUrl");
    String email = "";
    if (user != null){
    	email =user.getUserId();
    }
    
    Trip trip = new Trip(trip_name, email, url, desc);
   
    // Use Objectify to save the greeting and now() is used to make the call synchronously as we
    // will immediately get a new page using redirect and we want the data to be present.
    ObjectifyService.ofy().save().entity(trip).now();
    //resp.sendRedirect("/index.jsp?tripName=" + tripName);
    String json = new Gson().toJson(trip.id);
    
    resp.setContentType("application/json");
    resp.setCharacterEncoding("UTF-8");
    resp.getWriter().write(json);
  
  }
  
  
}