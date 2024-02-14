import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { convertTo12HourFormat } from "../globalFunctions/globalFunctions";

export async function getTripData(uid, tripid) {
  try {
    const docRef = doc(db, "userprofile", uid, "trips", tripid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document does not exist");
    }
  } catch (error) {
    console.error("Error fetching player stats:", error);
    throw error; // Propagate the error
  }
}

export async function getTripMealData(uid, tripid) {
  return new Promise((resolve, reject) => {
    const docCollection = query(
      collection(db, "userprofile", uid, "trips", tripid, "meals")
    );
    onSnapshot(
      docCollection,
      (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          var data = {
            id: doc.id,
            description: doc.data().description,
            category: doc.data().category,
            name: doc.data().name,
            review_stars: doc.data().review_stars,
            website: doc.data().website,
          };
          list.push(data);
        });
        resolve(list); // Resolve the promise with the list when the data is ready
      },
      (error) => {
        reject(error); // Reject the promise if there's an error
      }
    );
  });
}

export async function getTripActivityData(uid, tripid) {
  return new Promise((resolve, reject) => {
    const docCollection = query(
      collection(db, "userprofile", uid, "trips", tripid, "activities")
    );
    onSnapshot(
      docCollection,
      (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          var data = {
            id: doc.id,
            description: doc.data().description,
            hours_spent: doc.data().hours_spent,
            name: doc.data().name,
            review_stars: doc.data().review_stars,
            website: doc.data().website,
          };
          list.push(data);
        });
        resolve(list); // Resolve the promise with the list when the data is ready
      },
      (error) => {
        reject(error); // Reject the promise if there's an error
      }
    );
  });
}

export async function getSettingsData(uid) {
  return new Promise((resolve, reject) => {
    const docCollection = query(
      collection(db, "userprofile", uid, "settings"),
      orderBy("StartTime")
    );
    onSnapshot(
      docCollection,
      (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          var data = {
            id: doc.id,
            CalendarEvent: doc.data().CalendarEvent,
            StartTime: convertTo12HourFormat(doc.data().StartTime),
            EndTime: convertTo12HourFormat(doc.data().EndTime),
            StartTimeNonFormatted: doc.data().StartTime,
            EndTimeNonFormatted: doc.data().EndTime,
          };
          list.push(data);
        });
        resolve(list); // Resolve the promise with the list when the data is ready
      },
      (error) => {
        reject(error); // Reject the promise if there's an error
      }
    );
  });
}