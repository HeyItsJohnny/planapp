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
  lodgingData
) {
  try {
    const docRef = await addDoc(collection(db, "userprofile", uid, "trips"), {
      Destination: detailsData.Destination,
      StartDate: detailsData.StartDate,
      EndDate: detailsData.EndDate,
    });
    startCreateActivityDocuments(uid, docRef.id, activityData);
    startCreateMealDocuments(uid, docRef.id, mealData);
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

export async function createLodgingDataForTrip(uid, tripid, lodgingData) {
  try {
    await setDoc(doc(db, "userprofile", uid, "trips", tripid, "settings", "lodgingdata"), {
      Name: lodgingData.Name ?? "",
      Address1: lodgingData.Address1 ?? "",
      Address2: lodgingData.Address2 ?? "",
      City: lodgingData.City ?? "",
      State: lodgingData.State ?? "",
      ZipCode: lodgingData.ZipCode ?? "",
    });
  } catch (error) {
    console.error("There was an error adding to the database: " + error);
  }
}
