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
  activityData,
  mealData,
  lodgingData,
  itineraryData
) {
  try {
    const docRef = await addDoc(collection(db, "userprofile", uid, "trips"), {
      Destination: detailsData.Destination,
      StartDate: detailsData.StartDate,
      EndDate: detailsData.EndDate,
    });
    startCreateActivityDocuments(uid, docRef.id, activityData);
    startCreateMealDocuments(uid, docRef.id, mealData);
    startCreateItineraryDocuments(uid, docRef.id, itineraryData);
    createLodgingDataForTrip(uid, docRef.id, lodgingData);
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

function startCreateActivityDocuments(uid, tripid, activityData) {
  activityData.forEach((activity) => {
    addSavedActivitiesToTrip(uid, tripid, activity);
  });
}

function startCreateMealDocuments(uid, tripid, mealData) {
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
        review_stars: activityData.review_stars,
        website: activityData.website,
        hours_spent: activityData.hours_spent,
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
      description: activityData.description,
      review_stars: activityData.review_stars,
      website: activityData.website,
      category: activityData.category,
    });
    //return docRef.id;
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

export async function addSavedItineraryEventsToTrip(uid, tripid, itineraryData) {
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
    console.log(data.StartTime);
    await addDoc(collection(db, "userprofile", userid, "trips",tripid,"itinerary"), {
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
    alert("Error adding data to Database: " + error);
  }
}

export async function updateTripCalendarDoc(userid, tripid, data) {
  try {
    const calendarEventsRef = doc(db, "userprofile", userid, "trips",tripid,"itinerary", data.Id);
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
    await deleteDoc(doc(db, "userprofile", userid,"trips",tripid,"itinerary",docid));
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}
//Trip Schedule Component +
