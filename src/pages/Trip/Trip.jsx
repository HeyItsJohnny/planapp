import React, { useState, useEffect } from "react";
import { Header } from "../../components";
import TripItinerary from "./Itinerary/TripItinerary";
import TripActivities from "./TripActivities";
import TripMeals from "./TripMeals";
import TripSettings from "./TripSettings";
import UpdateLodgingModal from "./Modals/UpdateLodgingModal";
import DeleteTrip from "./Modals/DeleteTrip";

//Functions
import { useParams } from "react-router-dom";
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

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
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setTripLodging(docSnap.data());
        }
      });

      return unsubscribe;
    } catch (error) {
      alert("Error setting up lodging data listener:", error);
    }
  };

  useEffect(() => {
    setTripFromURL();
    setTripLodgingFromURL();
    return () => {
      setTrip({});
      setTripLodging({});
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl flex justify-between items-center">
        <div className="mt-5 w-72 md:w-400">
          <Header category={tripDates} title={trip.Destination} />
        </div>
        <DeleteTrip />
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl flex justify-between items-center">
        <div className="mt-5 w-72 md:w-400">
          <p className="text-xl font-semibold">Lodging</p>
          <br />
          <p className="text-md font-semibold">{tripLodging.Name}</p>
          <p className="text-md font-semibold">{tripLodging.Address1}</p>
          <p className="text-md font-semibold">{tripLodging.Address2}</p>
          <p className="text-md font-semibold">
            {tripLodging.City}, {tripLodging.State} {tripLodging.ZipCode}
          </p>
          <br />
        </div>
        <UpdateLodgingModal />
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="flex gap-10 flex-wrap justify-center">
          <TripActivities />
          <TripMeals />
          <TripSettings />
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
