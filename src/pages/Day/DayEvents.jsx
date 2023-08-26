import React, { useState, useEffect } from "react";

import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, collection, onSnapshot } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

import { deletePlanDayCalendar, addEventToCalendar } from "../../globalFunctions/firebaseGlobalFunctions";

import {
  convertTo12HourFormat,
  convertDateTimeString,
} from "../../globalFunctions/globalFunctions";

import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const DayEvents = () => {
  const navigate = useNavigate();
  const { currentSelectedPlan } = useStateContext();
  const { dayid } = useParams();
  //Calendar Settings
  const [calendarSettings, setCalendarSettings] = useState([]);
  const [planDay, setPlanDay] = useState({});

  const setDayFromURL = async () => {
    try {
      const docRef = doc(
        db,
        "plans",
        currentSelectedPlan,
        "datedocuments",
        dayid
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlanDay(docSnap.data());
      }
    } catch (err) {
      alert(err);
    }
  };

  const fetchCalendarSettingsData = async () => {
    const docCollection = query(collection(db, "calendarsettings"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          CalendarEvent: doc.data().CalendarEvent,
          StartTimeFormatted: convertTo12HourFormat(doc.data().StartTime),
          StartTime: doc.data().StartTime,
          EndTimeFormatted: convertTo12HourFormat(doc.data().EndTime),
          EndTime: doc.data().EndTime,
        };
        list.push(data);
      });
      setCalendarSettings(list);
    });
  };

  const addEverydayCalendarEvent = async (item) => {
    deletePlanDayCalendar(currentSelectedPlan,dayid,item.CalendarEvent + "_" + planDay.PlanDate);
    const StartDateTime = convertDateTimeString(planDay.PlanDate, item.StartTime);
    const EndDateTime = convertDateTimeString(planDay.PlanDate, item.EndTime);
    addEventToCalendar(currentSelectedPlan,StartDateTime,EndDateTime,dayid,item.CalendarEvent + "_" + planDay.PlanDate,item.CalendarEvent);
    toast("Added "+ item.CalendarEvent + " to calendar.");
  };

  const goToCalendarSetupPage = () => {
    navigate("/plansettings/");
  };

  useEffect(() => {
    fetchCalendarSettingsData();
    setDayFromURL();
    return () => {
      setCalendarSettings([]);
      setPlanDay({});
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div className="flex justify-between items-center gap-2">
          <button
            type="button"
            className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
            onClick={goToCalendarSetupPage}
          >
            <p className="text-xl font-semibold">Everyday Calendar Events</p>
          </button>
        </div>
        <div className="mt-5 w-72 md:w-400">
          {calendarSettings.map((item) => (
            <div key={item.id} className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    color: "#03C9D7",
                    backgroundColor: "#E5FAFB",
                  }}
                  className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                  onClick={() => {
                    addEverydayCalendarEvent(item);
                  }}
                >
                  <IoIosAddCircle />
                </button>
                <div>
                  <p className="text-md font-semibold">{item.CalendarEvent}</p>
                </div>
              </div>
              <p>
                {item.StartTimeFormatted} - {item.EndTimeFormatted}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DayEvents;
