import React, { useState, useEffect } from "react";
import { Header } from "../../components";

//Functions
import { useParams } from "react-router-dom";
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const TripSettings = () => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [tripLodging, setTripLodging] = useState({});

  const setTripLodgingFromURL = async () => {
    try {
      const docRef = doc(
        db,
        "userprofile",
        currentUser.uid,
        "trips",
        tripid,
        "settings",
        "lodgingdata"
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTripLodging(docSnap.data());
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    setTripLodgingFromURL();
    return () => {
      setTripLodging({});
    };
  }, []);
  return (
    <>
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Settings</p>
        </div>
        <div className="mt-5 w-72 md:w-400">
          <p className="text-md font-semibold">{tripLodging.Name}</p>
          <p className="text-md font-semibold">{tripLodging.Address1}</p>
          <p className="text-md font-semibold">{tripLodging.Address2}</p>
          <p className="text-md font-semibold">
            {tripLodging.City}, {tripLodging.State} {tripLodging.ZipCode}
          </p>
          <br />
          <p>Maybe Google Maps Link here..</p>
        </div>
      </div>
    </>
  );
};

export default TripSettings;
