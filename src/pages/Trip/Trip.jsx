import React, { useState, useEffect } from "react";
import { Header } from "../../components";
import TripItinerary from "./TripItinerary";
import TripActivities from "./TripActivities";
import TripMeals from "./TripMeals";
import TripSettings from "./TripSettings";

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
  const [tripLodging, setTripLodging] = useState({});
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
    setTripFromURL();
    setTripLodgingFromURL();
    return () => {
      setTrip({});
      setTripLodging([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl flex justify-between items-center">
        <Header category={tripDates} title={trip.Destination} />

        <div className="mt-5 w-72 md:w-400">
          <p className="text-xl font-semibold">Lodging</p>
          <br/>
          <p className="text-md font-semibold">{tripLodging.Name}</p>
          <p className="text-md font-semibold">{tripLodging.Address1}</p>
          <p className="text-md font-semibold">{tripLodging.Address2}</p>
          <p className="text-md font-semibold">
            {tripLodging.City}, {tripLodging.State} {tripLodging.ZipCode}
          </p>
        </div>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="flex gap-10 flex-wrap justify-center">
          <TripSettings />
          <TripActivities destination={trip.Destination}/>
          <TripMeals destination={trip.Destination}/>
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
