import React, { useState, useEffect } from "react";

//Visual
import { AiOutlineCheck } from "react-icons/ai";
import { AiTwotoneDelete } from "react-icons/ai";
import NewSettingModal from "./Modals/NewSettingModal";

//Functions
import { useParams } from "react-router-dom";
import { startAddingSettings, deleteSettingDoc } from "../../globalFunctions/firebaseFunctions";
import { convertTo12HourFormat } from "../../globalFunctions/globalFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TripSettings = () => {
  const { currentUser } = useAuth();
  const { currentColor } = useStateContext();
  const { tripid } = useParams();

  const [settings, setSettings] = useState([]);
  const [trip, setTrip] = useState({});

  //Get Trip Destination -
  const setTripFromURL = async () => {
    try {
      const docRef = doc(db, "userprofile", currentUser.uid, "trips", tripid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrip(docSnap.data());
      }
    } catch (err) {
      alert(err);
    }
  };
  //Get Trip Destination +

  const fetchPlanSettingsData = async () => {
    const docCollection = query(
      collection(db, "userprofile", currentUser.uid, "settings"),
      orderBy("StartTime")
    );
    onSnapshot(docCollection, (querySnapshot) => {
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
      setSettings(list);
    });
  };

  const removeSetting = (setting) => {
    deleteSettingDoc(currentUser.uid, setting.id);
    toast(setting.CalendarEvent + " removed from settings.");
  };

  const addToCalendar = async (item) => {
    startAddingSettings(
      trip.StartDate,
      trip.EndDate,
      currentUser.uid,
      tripid,
      item
    );
    toast("Add to Calendar: " + item.CalendarEvent);
  };

  useEffect(() => {
    fetchPlanSettingsData();
    setTripFromURL();
    return () => {
      setSettings([]);
    };
  }, []);
  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Settings</p>
        </div>
        <div className="mt-5 mb-5 w-72 md:w-400">
          {settings.map((setting) => (
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    backgroundColor: currentColor,
                    color: "White",
                  }}
                  className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                  onClick={() => {
                    addToCalendar(setting);
                  }}
                >
                  <AiOutlineCheck />
                </button>
                <div>
                  <p className="text-md font-semibold">
                    {setting.CalendarEvent}
                  </p>
                  <p className="text-sm text-gray-400">
                    {setting.StartTime} - {setting.EndTime}
                  </p>
                </div>
              </div>
              <button
                type="button"
                style={{
                  backgroundColor: "#FF0000",
                  color: "White",
                }}
                className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                onClick={() => removeSetting(setting)}
              >
                <AiTwotoneDelete />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end items-center gap-2">
          <NewSettingModal />
        </div>
      </div>
    </>
  );
};

export default TripSettings;
