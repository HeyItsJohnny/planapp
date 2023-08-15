import React, { useState, useEffect } from "react";

import { db  } from "../firebase/firebase";

import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  deleteDoc,
  updateDoc,
  addDoc
} from "firebase/firestore";

export async function getPlans() {
  const docCollection = query(collection(db, "plans"));
  const list = [];
  onSnapshot(docCollection, (querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var data = {
        id: doc.id,
        Name: doc.data().Name,
        Type: doc.data().Type,
        SubType: doc.data().SubType,
      };
      list.push(data);
    });
  });
  console.log("HIT 1...");
  console.log(list);
  return list;
}

export async function deleteDocument(name, docid) {
  try {
    await deleteDoc(doc(db, name, docid));
  } catch (error) {
    alert("Error deleting data from Firestore:", error);
  }
};

export async function updatePlanStartDate(planid, start) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      StartDate: start,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
};

export async function updatePlanEndDate(planid, end) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      EndDate: end,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
};

export async function updatePlanDestination(planid, destination) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      Destination: destination,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
};

export async function addToPlanCalendar(planid,data) {
  try {
    await addDoc(collection(db, "plans", planid, "calendar"),
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

export async function updatePlanCalendar(planid,data) {
  try {
    const calendarEventsRef = doc(db,"plans",planid,"calendar",data.Id);
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

export async function deletePlanCalendar(planid, docid) {
  try {
    await deleteDoc(doc(db,"plans",planid,"calendar",docid)
    );
  } catch (error) {
    alert("Error deleting data from Database: " + error);
  }
}

export async function updatePlanEnableAirfare(planid, displayValue) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      EnableAirfare: displayValue,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
};

export async function updatePlanEnableLodging(planid, displayValue) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      EnableLodging: displayValue,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
};

export async function updatePlanEnableBudget(planid, displayValue) {
  try {
    const familyPlansRef = doc(db, "plans", planid);
    await updateDoc(familyPlansRef, {
      EnableBudget: displayValue,
    });
  } catch (error) {
    alert("Error editing data to Database: " + error);
  }
};




/*
export const getUserProfile = async (uid) => {
  const userRef = firestore.collection('users').doc(uid);
  const userDoc = await userRef.get();
  
  if (userDoc.exists) {
    return userDoc.data();
  } else {
    return null;
  }
};
*/
