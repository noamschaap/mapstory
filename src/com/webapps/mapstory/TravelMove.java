package com.webapps.mapstory;

import java.util.Date;

import com.google.appengine.api.datastore.GeoPt;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;
import com.googlecode.objectify.annotation.Subclass;

/**
 * The @Entity tells Objectify about our entity.  We also register it in {@link OfyHelper}
 * Our primary key @Id is set automatically by the Google Datastore for us.
 *
 * We add a @Parent to tell the object about its ancestor. We are doing this to support many
 * guestbooks.  Objectify, unlike the AppEngine library requires that you specify the fields you
 * want to index using @Index.  Only indexing the fields you need can lead to substantial gains in
 * performance -- though if not indexing your data from the start will require indexing it later.
 *
 * NOTE - all the properties are PUBLIC so that can keep the code simple.
 **/
@Subclass(index=true)
public class TravelMove extends TravelStep{

  public GeoPt start_loc;
  public GeoPt end_loc;
  public String path;
  public String travel_type;

  public TravelMove(){
	  
  }
  
  /**
   * Simple constructor just calls super
   **/
  public TravelMove(Long tripid, String atitle, String adescription, int astepnumber) {
    super(tripid,atitle,adescription,astepnumber);
  }

 
  /**
   * Takes all important fields
   **/
  public TravelMove(Long tripid, String apath, GeoPt start, GeoPt end,
		  String atitle, String adescription, int astepnumber, String atravel_type) {
    
    this(tripid, atitle, adescription, astepnumber);
    
    this.start_loc = start;
    this.end_loc = end;
    this.travel_type = atravel_type;
    this.path = apath;
  }

	
}