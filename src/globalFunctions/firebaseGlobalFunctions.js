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

import { getDatesBetween } from "./globalFunctions";

export async function addNewPlan(data) {
  try {
    const docRef = await addDoc(collection(db, "plans"), {
      Name: data.target.Name.value,
      Destination: data.target.Destination.value,
      StartDate: data.target.StartDate.value,
      EndDate: data.target.EndDate.value,
      EnableAirfare: false,
      EnableLodging: false,
      EnableToDos: false,
    });
    startCreateDateDocuments(data,docRef.id);
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

function startCreateDateDocuments(data, docID) {
  const arrayOfDates = getDatesBetween(data.target.StartDate.value,data.target.EndDate.value);
  arrayOfDates.forEach((date) => {
    addNewPlanDateDocuments(data, docID, date);
  });
}

async function addNewPlanDateDocuments(data, docID, date) {
  try {
    await addDoc(collection(db, "plans", docID, "datedocuments"), {
      PlanName: data.target.Name.value,
      PlanDate: date
    });
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}

//Summary Page
export async function updatePlanDestination(planid, destination) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      Destination: destination,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
}

//Day Page
export async function deleteDayDocument(planid, docid) {
  try {
    await deleteDoc(doc(db, "plans", planid, "datedocuments", docid));
  } catch (error) {
    alert("Error deleting data from Firestore:", error);
  }
}

export async function addToPlanDayCalendar(planid, dayid, data) {
  try {
    console.log(data.StartTime);
    await addDoc(collection(db, "plans", planid, "datedocuments", dayid, "calendar"), {
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

export async function updatePlanDayCalendar(planid, dayid, data) {
  try {
    const calendarEventsRef = doc(db, "plans", planid, "datedocuments", dayid, "calendar", data.Id);
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

export async function deletePlanDayCalendar(planid, dayid, docid) {
  try {
    await deleteDoc(doc(db, "plans", planid, "datedocuments", dayid, "calendar", docid));
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}

export async function addEventToCalendar(planid, startdate, enddate, dayid, docid, calsubject) {
  try {
    await setDoc(doc(db, "plans", planid, "datedocuments", dayid, "calendar", docid), {
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
    });
  } catch (error) {
    alert("There was an error adding to the database: " + error);
  }
}
