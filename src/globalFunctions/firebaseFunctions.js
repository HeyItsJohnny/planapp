import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  onSnapshot,
  deleteDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import { getDatesBetween, convertDateTimeString, convertDateFormat2 } from "./globalFunctions";

export async function createUserProfile(email, fullname, uid) {
  try {
    await setDoc(doc(db, "userprofile", uid), {
      Email: email,
      FullName: fullname,
    });
  } catch (error) {
    console.error("There was an error adding to the database: " + error);
  }
}

export async function addNewTripPlan(
  uid,
  detailsData,
  timeData,
  activityData,
  mealData,
  //lodgingData,
  itineraryData
) {
  try {
    const docRef = await addDoc(collection(db, "userprofile", uid, "trips"), {
      TripType: detailsData.TripType,
      Destination: detailsData.Destination,
      Category: detailsData.Category,
      StartDate: detailsData.StartDate,
      EndDate: detailsData.EndDate,
      WakeUpTime: timeData.WakeUpTime,
      BedTime: timeData.BedTime

    });
    startCreateActivityDocuments(uid, docRef.id, activityData);
    startCreateMealDocuments(uid, docRef.id, mealData);
    startCreateItineraryDocuments(uid, docRef.id, itineraryData);
    //createLodgingDataForTrip(uid, docRef.id, lodgingData);
    return docRef.id;
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

function startCreateActivityDocuments(uid, tripid, activityData) {
  console.log(activityData);
  activityData.forEach((activity) => {
    addSavedActivitiesToTrip(uid, tripid, activity);
  });
}

function startCreateMealDocuments(uid, tripid, mealData) {
  console.log(mealData);
  mealData.forEach((meal) => {
    addSavedMealsToTrip(uid, tripid, meal);
  });
}

function startCreateItineraryDocuments(uid, tripid, itineraryData) {
  itineraryData.forEach((data) => {
    addSavedItineraryEventsToTrip(uid, tripid, data);
  });
}

export async function addSavedActivitiesToTrip(uid, tripid, activityData) {
  try {
    await addDoc(
      collection(db, "userprofile", uid, "trips", tripid, "activities"),
      {
        name: activityData.name,
        description: activityData.description,
        /*
        review_stars: activityData.review_stars,
        website: activityData.website,
        hours_spent: activityData.hours_spent,
        */
      }
    );
    //return docRef.id;
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export async function addSavedMealsToTrip(uid, tripid, activityData) {
  try {
    await addDoc(collection(db, "userprofile", uid, "trips", tripid, "meals"), {
      name: activityData.name,
      //description: activityData.description,
      review_stars: activityData.review_stars,
      //website: activityData.website,
      category: activityData.category,
    });
    //return docRef.id;
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export async function addSavedItineraryEventsToTrip(
  uid,
  tripid,
  itineraryData
) {
  try {
    await addDoc(
      collection(db, "userprofile", uid, "trips", tripid, "itinerary"),
      {
        Subject: itineraryData.Subject,
        Location: itineraryData.Location ?? "",
        Description: itineraryData.Description ?? "",
        StartTime: itineraryData.StartTime ?? "",
        EndTime: itineraryData.EndTime ?? "",
        IsAllDay: itineraryData.IsAllDay ?? "",
        RecurrenceRule: itineraryData.RecurrenceRule ?? "",
        RecurrenceException: itineraryData.RecurrenceException ?? "",
        CategoryColor: itineraryData.CategoryColor ?? "",
        EventColor: itineraryData.EventColor ?? "",
      }
    );
    //return docRef.id;
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export async function createLodgingDataForTrip(uid, tripid, lodgingData) {
  try {
    await setDoc(
      doc(db, "userprofile", uid, "trips", tripid, "settings", "lodgingdata"),
      {
        Name: lodgingData.Name ?? "",
        Address1: lodgingData.Address1 ?? "",
        Address2: lodgingData.Address2 ?? "",
        City: lodgingData.City ?? "",
        State: lodgingData.State ?? "",
        ZipCode: lodgingData.ZipCode ?? "",
      }
    );
  } catch (error) {
    console.error("There was an error adding to the database: " + error);
  }
}
//Trip Schedule Component -
export async function createNewTripCalendarDoc(userid, tripid, data) {
  try {
    await addDoc(
      collection(db, "userprofile", userid, "trips", tripid, "itinerary"),
      {
        Subject: data.Subject,
        Location: data.Location ?? "",
        Description: data.Description ?? "",
        StartTime: data.StartTime ?? "",
        EndTime: data.EndTime ?? "",
        IsAllDay: data.IsAllDay ?? "",
        RecurrenceRule: data.RecurrenceRule ?? "",
        RecurrenceException: data.RecurrenceException ?? "",
        CategoryColor: data.CategoryColor ?? "",
        EventColor: data.EventColor ?? "",
      }
    );
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export async function updateTripCalendarDoc(userid, tripid, data) {
  try {
    const calendarEventsRef = doc(
      db,
      "userprofile",
      userid,
      "trips",
      tripid,
      "itinerary",
      data.Id
    );
    await updateDoc(calendarEventsRef, {
      Subject: data.Subject,
      Location: data.Location ?? "",
      Description: data.Description ?? "",
      StartTime: data.StartTime ?? "",
      EndTime: data.EndTime ?? "",
      IsAllDay: data.IsAllDay ?? "",
      RecurrenceRule: data.RecurrenceRule ?? "",
      RecurrenceException: data.RecurrenceException ?? "",
      CategoryColor: data.CategoryColor ?? "",
      EventColor: data.EventColor ?? "",
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
}

export async function deleteTripCalendarDoc(userid, tripid, docid) {
  try {
    await deleteDoc(
      doc(db, "userprofile", userid, "trips", tripid, "itinerary", docid)
    );
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}
//Trip Schedule Component +

//Trip Additions -
export async function addActivityDoc(userid, tripid, data) {
  try {
    await addDoc(
      collection(db, "userprofile", userid, "trips", tripid, "activities"),
      {
        name: data.target.name.value ?? "",
        website: data.target.website.value ?? "www.google.com",
        hours_spent: data.target.hours_spent.value ?? "",
        review_stars: "",
      }
    );
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
}

export async function addMealDoc(userid, tripid, data) {
  try {
    await addDoc(
      collection(db, "userprofile", userid, "trips", tripid, "meals"),
      {
        name: data.target.name.value,
        website: data.target.website.value ?? "www.google.com",
        category: data.target.category.value ?? "",
        review_stars: "",
      }
    );
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
}

export async function deleteActivityMealDoc(userid, tripid, docid, type) {
  try {
    await deleteDoc(
      doc(db, "userprofile", userid, "trips", tripid, type, docid)
    );
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}

export function startCreateAIActivityDocuments(uid, tripid, activityData) {
  activityData.forEach((activity) => {
    addAITripActivity(uid, tripid, activity);
  });
}

export async function addAITripActivity(uid, tripid, data) {
  try {
    await addDoc(
      collection(db, "userprofile", uid, "trips", tripid, "activities"),
      {
        name: data.activity_name ?? "",
        website: data.website ?? "www.google.com",
        hours_spent: data.hours_spent ?? "",
        review_stars: data.review_stars ?? "",
      }
    );
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export function startCreateAIMealDocuments(uid, tripid, mealData) {
  mealData.forEach((meal) => {
    addAITripMeal(uid, tripid, meal);
  });
}

export async function addAITripMeal(uid, tripid, data) {
  try {
    await addDoc(collection(db, "userprofile", uid, "trips", tripid, "meals"), {
      name: data.restaurant_name,
      website: data.website ?? "www.google.com",
      category: data.category ?? "",
      review_stars: data.review_stars ?? "",
    });
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}
//Trip Additions +

//Settings -
export async function addNewSettings(uid, data) {
  try {
    await addDoc(collection(db, "userprofile", uid, "settings"), {
      CalendarEvent: data.target.CalendarEvent.value,
      StartTime: data.target.StartTime.value,
      EndTime: data.target.EndTime.value,
    });
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export function startAddingSettings(StartDate, EndDate, uid, tripid, data) {
  const arrayOfDates = getDatesBetween(StartDate, EndDate);
  arrayOfDates.forEach((date) => {
    //console.log("Date: " + date);
    //console.log(data);

    //Delete Calendar Event
    const eventSubject = data.CalendarEvent + "_" + date;
    deleteTripCalendarDoc(uid, tripid, eventSubject);

    //add to calendar
    const StartDateTime = convertDateTimeString(
      date,
      data.StartTimeNonFormatted
    );
    const EndDateTime = convertDateTimeString(date, data.EndTimeNonFormatted);

    //Set new Setting Document ID
    addSettingToCalendar(
      uid,
      tripid,
      eventSubject,
      StartDateTime,
      EndDateTime,
      data.CalendarEvent
    );
  });
}

export async function addSettingToCalendar(
  uid,
  tripid,
  docid,
  startdate,
  enddate,
  calsubject
) {
  try {
    await setDoc(
      doc(db, "userprofile", uid, "trips", tripid, "itinerary", docid),
      {
        CategoryColor: "",
        Description: "",
        EndTime: enddate,
        EventColor: "",
        IsAllDay: false,
        Location: "",
        RecurrenceException: "",
        RecurrenceRule: "",
        StartTime: startdate,
        Subject: calsubject,
      }
    );
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export async function deleteSettingDoc(uid, docid) {
  try {
    await deleteDoc(doc(db, "userprofile", uid, "settings", docid));
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}
//Settings +

//Lodging -
export async function updateLodgingDoc(uid, tripid, lodgingData) {
  try {
    const calendarEventsRef = doc(db,"userprofile",uid,"trips",tripid,"settings","lodgingdata");
    await updateDoc(calendarEventsRef, {
      Name: lodgingData.Name ?? "",
      Address1: lodgingData.Address1 ?? "",
      Address2: lodgingData.Address2 ?? "",
      City: lodgingData.City ?? "",
      State: lodgingData.State ?? "",
      ZipCode: lodgingData.ZipCode ?? "",
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
}
//Lodging +

//Create new Trip
export async function createNewTrip(uid,data) {
  try {
    const docRef = await addDoc(collection(db, "userprofile", uid, "trips"), {
      TripName: data.target.TripName.value,
      Destination: data.target.Destination.value,
      StartDate: data.target.StartDate.value,
      EndDate: data.target.EndDate.value,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding data to Database: ", error);
    throw error;
  }
}

//Add ChatGPT Items to Itinerary
export function addChatGPTTripData(uid, tripid, itinerarydata, tripdata) {
  itinerarydata.forEach((data) => {
    deleteTripCalendarDoc(uid,tripid,data.Id);
  });
  tripdata.forEach((data) => {
   addNewItineraryDoc(uid,tripid,data);
  });
}

export async function addNewItineraryDoc(userid, tripid, data) {
  try {
    const StartTime = convertDateTimeString(convertDateFormat2(data.day),data.start_time);
    const EndTime = convertDateTimeString(convertDateFormat2(data.day),data.end_time);

    await addDoc(collection(db, "userprofile", userid, "trips", tripid, "itinerary"),
      {
        Subject: data.activity,
        Location: "",
        Description: "",
        StartTime: StartTime,
        EndTime: EndTime,
        IsAllDay: false,
        RecurrenceRule: "",
        RecurrenceException: "",
        CategoryColor: "",
        EventColor: "",
      }
    );
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

//Delete Trip
export function deleteTrip(uid, tripid, settingsdata, itinerarydata, activitiesdata, mealsdata) {
  settingsdata.forEach((data) => {
    deleteTripDataDoc(uid,tripid,data.id,"settings");
  });

  itinerarydata.forEach((data) => {
    deleteTripDataDoc(uid,tripid,data.Id,"itinerary");
  });

  activitiesdata.forEach((data) => {
    deleteTripDataDoc(uid,tripid,data.id,"activities");
  });

  mealsdata.forEach((data) => {
    deleteTripDataDoc(uid,tripid,data.id,"meals");
  });

  deleteTripDoc(uid,tripid);
}

export async function deleteTripDataDoc(userid, tripid, docid, collec) {
  try {
    await deleteDoc(
      doc(db, "userprofile", userid, "trips", tripid, collec, docid)
    );
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}

export async function deleteTripDoc(userid, tripid) {
  try {
    await deleteDoc(
      doc(db, "userprofile", userid, "trips", tripid)
    );
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}
