package com.webapps.mapstory;

import java.util.Date;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;

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
@Entity
public class TravelStep implements Comparable<TravelMove>{
  @Parent Key<Trip> theTrip;
  @Id public Long id;

  @Index public int stepnumber;
  public String title;
  public String description;
  public String when;
  @Index public Date date;

  /**
   * Simple constructor just sets the date
   **/
  public TravelStep() {
    date = new Date();
  }

  
  
  /**
   * Takes all important fields
   **/
  public TravelStep(Long tripid, String atitle, String adescription, int astepnumber) {
    
    this();
    theTrip = Key.create(Trip.class, tripid);
    this.title = atitle;
    this.description = adescription;
    this.stepnumber = astepnumber;
  }

	public int compareTo(TravelMove t) {
		// TODO Auto-generated method stub
		if ( this.stepnumber < t.stepnumber )
			return -1;
		else
			return 1;
	}

	
}