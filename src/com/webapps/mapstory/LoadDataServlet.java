package com.webapps.mapstory;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.googlecode.objectify.ObjectifyService;

/**
 * Form Handling Servlet
 * Most of the action for this sample is in webapp/guestbook.jsp, which displays the
 * {@link Greeting}'s. This servlet has one method
 * {@link #doPost(<#HttpServletRequest req#>, <#HttpServletResponse resp#>)} which takes the form
 * data and saves it.
 */
public class LoadDataServlet extends HttpServlet {

  // Process the http POST of the form
  @Override
  public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
    TravelMove travelstep;

    UserService userService = UserServiceFactory.getUserService();
    User user = userService.getCurrentUser();  // Find out who the user is.
    
    
    
    String tripname = "Barcelona";
    
    List<Trip> trips = ObjectifyService.ofy()
            .load()
            .type(Trip.class) // We want only Trips
            .filter("trip_name",tripname)
            //.order("-date")       // Most recent first - date is indexed.
            //.limit(5)             // Only show 5 of them.
            .list();
    Long theTripKey = trips.get(0).id;
    
    String description = "Family trip to Barcelona 2015";
    TravelMove tstep = new TravelMove(theTripKey, "", new GeoPt(40.6413111f,-73.7781391f),
    		new GeoPt(41.2974329f,2.082468f), "Flight from JFK to Barcelona","", 0, "plane");
  		 
    ObjectifyService.ofy().save().entity(tstep).now();
    
    String tripUrl = "https://upload.wikimedia.org/wikipedia/commons/f/f5/Torre_Agbar.jpg";
    TravelStop tstop = new TravelStop(theTripKey, new GeoPt(41.403526f, 2.189503f),
    		"Incredible Archtechture", 1, "Torre Agbar",tripUrl);
    ObjectifyService.ofy().save().entity(tstop).now();
    
    tripUrl = "https://upload.wikimedia.org/wikipedia/commons/b/b9/Parc_G%C3%BCell_%28Barcelona%29_-_58.jpg";
    tstop = new TravelStop(theTripKey, new GeoPt(41.414382f, 2.152662f),
    		"Fun day in the park", 2, "Parc Güell",tripUrl);
    ObjectifyService.ofy().save().entity(tstop).now();
    /*
    String tripName = "Barcelona";
    String tripUrl = "https://upload.wikimedia.org/wikipedia/commons/6/6f/Sta-eulalia.jpg";
    String description = "Family trip to Barcelona 2015";
    Trip trip = new Trip(tripName, tripUrl, description);
    ObjectifyService.ofy().save().entity(trip).now();
    
    tripName = "Cross Country Trip";
    tripUrl = "https://upload.wikimedia.org/wikipedia/commons/d/d3/Lincoln_Center_Twilight.jpg";
    description = "My trip across the country to New York City";
    trip = new Trip(tripName, tripUrl, description);
    ObjectifyService.ofy().save().entity(trip).now();
   
   	*/
    // Use Objectify to save the greeting and now() is used to make the call synchronously as we
    // will immediately get a new page using redirect and we want the data to be present.
    //ObjectifyService.ofy().save().entity(trip).now();
    //resp.sendRedirect("/index.jsp?tripName=" + tripName);
    resp.setContentType("text/plain");
	resp.getWriter().println("worked");
  }
  
  
}