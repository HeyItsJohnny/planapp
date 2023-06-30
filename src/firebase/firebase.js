import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMRhz_dFOnoFOYzCL_BqaYpycNUwya93U",
  authDomain: "homey2-db72b.firebaseapp.com",
  projectId: "homey2-db72b",
  storageBucket: "homey2-db72b.appspot.com",
  messagingSenderId: "112927720133",
  appId: "1:112927720133:web:21b9e1a4d916948370e6ac",
  measurementId: "G-5RVYGBJDK4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
