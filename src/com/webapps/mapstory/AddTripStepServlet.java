package com.webapps.mapstory;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

/**
 * Form Handling Servlet
 * Most of the action for this sample is in webapp/guestbook.jsp, which displays the
 * {@link Greeting}'s. This servlet has one method
 * {@link #doPost(<#HttpServletRequest req#>, <#HttpServletResponse resp#>)} which takes the form
 * data and saves it.
 */
public class AddTripStepServlet extends HttpServlet {

  // Process the http POST of the form
  @Override
  public void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {

    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();  // Find out who the user is.

    //String abc = req.getParameter("tripid");
    //System.out.println(abc); 
    int type = Integer.parseInt(req.getParameter("type"));
    Long tripid = Long.parseLong(req.getParameter("tripid"));
    String title = req.getParameter("title");
    String description = req.getParameter("desc");
    String url = req.getParameter("url");

    Float lat = Float.parseFloat(req.getParameter("lat"));
	Float lng = Float.parseFloat(req.getParameter("lng"));
    
    String path = req.getParameter("path");
    String traveltype = req.getParameter("traveltype");
    
    List<TravelStep> travelsteps = ObjectifyService.ofy()
	          .load()
	          .type(TravelStep.class) // We want only TravelSteps
	          .ancestor(Key.create(Trip.class, tripid))
	          .order("-stepnumber")       // Most recent first - date is indexed.
	          //.limit(5)             // Only show 5 of them.
	          .list();
    
    int ordernum = travelsteps.size();
    
    if (type == 1){
    	
    	Float lat2 = Float.parseFloat(req.getParameter("lat2"));
    	Float lng2 = Float.parseFloat(req.getParameter("lng2"));
    	
    	TravelMove tmove = new TravelMove(tripid, path,  
    			new GeoPt(lat, lng),  new GeoPt(lat2, lng2),
    			   title, description, ordernum, traveltype);
    	ObjectifyService.ofy().save().entity(tmove).now();
    }
    else if (type == 2){
    	TravelStop tstop = new TravelStop(tripid, new GeoPt(lat, lng),
    		description, ordernum, title, url);
    	ObjectifyService.ofy().save().entity(tstop).now();
    }
   
    if (ordernum == 1){
    	Trip t = ObjectifyService.ofy()
    	          .load()
    	          .type(Trip.class) // We want only Trips
    	          .id(tripid)
    	          .now();
    	t.center_loc = new GeoPt(lat, lng);
    	ObjectifyService.ofy().save().entity(t).now();
    }
    
    // Use Objectify to save the greeting and now() is used to make the call synchronously as we
    // will immediately get a new page using redirect and we want the data to be present.
    //ObjectifyService.ofy().save().entity(travelstep).now();
    //ObjectifyService.ofy().save().entity(trip).now();
    //resp.sendRedirect("/index.jsp?tripName=" + tripName);
  }
  
  
}