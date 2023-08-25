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
