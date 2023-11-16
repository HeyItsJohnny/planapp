import React, { useState, useEffect } from "react";
import { Header } from "../../components";
import TripItinerary from "./TripItinerary";
import TripActivities from "./TripActivities";
import TripMeals from "./TripMeals";
import TripLodgingDetails from "./TripLodgingDetails";

//Functions
import { useParams } from "react-router-dom";
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Trip = () => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [trip, setTrip] = useState({});
  const [tripDates, setTripDates] = useState("");

  const setTripFromURL = async () => {
    try {
      const docRef = doc(db, "userprofile", currentUser.uid, "trips", tripid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
        setTripDates(
          convertDateFormat(docSnap.data().StartDate) +
            " - " +
            convertDateFormat(docSnap.data().EndDate)
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    setTripFromURL();
    return () => {
      setTrip({});
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl flex justify-between items-center">
        <Header category={tripDates} title={trip.Destination} />
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="flex gap-10 flex-wrap justify-center">
          <TripLodgingDetails />
          <TripActivities />
          <TripMeals />
        </div>
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="Itinerary" />
        <TripItinerary trip={trip} />
      </div>
    </>
  );
};

export default Trip;
