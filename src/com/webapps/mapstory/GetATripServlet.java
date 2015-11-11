package com.webapps.mapstory;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;

/**

 */
public class GetATripServlet extends HttpServlet {

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		String tripname = request.getParameter("story");
		
		Key<Trip> theTrip = Key.create(Trip.class, tripname);
		
		List<TravelMove> trs =  ObjectifyService.ofy()
				.load()
				.type(TravelMove.class)
				.ancestor(theTrip)
				.list();
		
		Collections.sort(trs);
		
	    String json = new Gson().toJson(trs);

	    response.setContentType("application/json");
	    response.setCharacterEncoding("UTF-8");
	    response.getWriter().write(json);
	}
  
}