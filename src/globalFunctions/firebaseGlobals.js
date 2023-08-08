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
