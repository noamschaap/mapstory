package com.webapps.mapstory;

import com.google.appengine.api.datastore.GeoPt;
import com.googlecode.objectify.Key;
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
public class TravelStop extends TravelStep{
 
  public GeoPt loc;
  public String img_url;

  public TravelStop(){
	  
  }
  /**
  * Simple constructor just calls super
  **/
 public TravelStop(Long tripid, String atitle, String adescription, int astepnumber) {
   super(tripid,atitle,adescription,astepnumber);
 }

  /**
   * Takes all important fields
   **/
  public TravelStop(Long tripid, GeoPt loc, 
		  String adescription, int astepnumber, String atitle, String imgurl) {
    
	  this(tripid, atitle, adescription, astepnumber);
   
	  this.loc = loc;
	  this.img_url = imgurl;
  }
	
}