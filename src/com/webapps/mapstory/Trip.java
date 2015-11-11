package com.webapps.mapstory;

import com.google.appengine.api.datastore.GeoPt;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Index;


/**
 * The @Entity tells Objectify about our entity.  We also register it in
 * OfyHelper.java -- very important.
 *
 * This is never actually created, but gives a hint to Objectify about our Ancestor key.
 */
@Entity
public class Trip {
	
	@com.googlecode.objectify.annotation.Id Long id;
	@Index public String trip_name;
	//@Index public User user;
	@Index public String user_id;
	@Index public String trip_img_url;
	public String trip_subtitle;
	@Index public GeoPt center_loc;
  
  public Trip() {
	   
  }
  
  public Trip(String trip_name, String userid, String subtitle) {
	  this.trip_name = trip_name;
	  this.user_id = userid;
	  this.trip_subtitle = subtitle;
  }
  public Trip(String trip_name, String userid, String url, String subtitle) {
	  this.trip_name = trip_name;
	  this.user_id = userid;
	  this.trip_img_url = url;
	  this.trip_subtitle = subtitle;
  }
  
  /*
  public Trip(String trip_name, String url, String title, String subtitle) {
	  this.trip_name = trip_name;
	  this.trip_img_url = url;
	  this.trip_title = title;
	  this.trip_subtitle = subtitle;
  }
  */
}