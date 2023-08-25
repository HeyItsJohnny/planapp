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

export async function addNewPlan(data) {
  try {
    await addDoc(collection(db, "plans"), {
      Name: data.target.Name.value,
      Destination: data.target.Destination.value,
      StartDate: data.target.StartDate.value,
      EndDate: data.target.EndDate.value,
      EnableAirfare: false,
      EnableLodging: false,
      EnableToDos: false,
    });
  } catch (error) {
    alert("Error adding data to Database: " + error);
  }
}
