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
