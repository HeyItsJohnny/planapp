import React, { useState, useEffect } from "react";

//Schedule Component
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  TimelineMonth,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Functions
import { useParams } from "react-router-dom";
import { getTripItineraryData, getTripData } from "../../../globalFunctions/firebaseGETFunctions";
import { useAuth } from "../../../contexts/AuthContext";
import { parseISO } from "date-fns";
import { createNewTripCalendarDoc, updateTripCalendarDoc, deleteTripCalendarDoc } from "../../../globalFunctions/firebaseFunctions";
import GenerateItinerary from "./GenerateItinerary";

const TripItinerary = () => {
  
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [calendarView, setCalendarView] = useState("Week");

  const fetchCalendarData = async () => {
    try {
      const data = await getTripItineraryData(currentUser.uid, tripid);
      setCalendarData(data);
    } catch(e) {
      alert("Error: " + e)
    }
  };

  const setTripFromURL = async () => {
    try {
      const data = await getTripData(currentUser.uid, tripid);
      if (data !== null) {
        setSelectedStartDate(parseISO(data.StartDate));
        if (data.StartDate === data.EndDate) {
          setCalendarView("Day");
        } else {
          setCalendarView("Week");
        }
      }
    } catch (err) {
      alert(err);
    }
  };

  const addEvent = async (args) => {
    if (args.requestType === "eventCreated") {
      createNewTripCalendarDoc(currentUser.uid, tripid, args.addedRecords[0]);
      toast("Event Added");
    } else if (args.requestType === "eventChanged") {
      updateTripCalendarDoc(currentUser.uid, tripid, args.changedRecords[0]);
      toast("Event Updated");
    } else if (args.requestType === "eventRemoved") {
      deleteTripCalendarDoc(currentUser.uid, tripid, args.deletedRecords[0].Id);
      toast("Event Deleted");
    }
  };

  useEffect(() => {
    fetchCalendarData();
    setTripFromURL();
    return () => {};
  }, []);

  return (
    <>
      <ToastContainer />
      <GenerateItinerary />
      <ScheduleComponent
        currentView={calendarView}
        height="650px"
        eventSettings={{
          dataSource: calendarData,
        }}
        actionComplete={addEvent}
        selectedDate={selectedStartDate || new Date()}
      >
        <ViewsDirective>
          <ViewDirective option="Day"></ViewDirective>
          <ViewDirective option="Week"></ViewDirective>
          <ViewDirective option="Month"></ViewDirective>
        </ViewsDirective>
        <Inject
          services={[
            Day,
            Week,
            WorkWeek,
            Month,
            Agenda,
            Resize,
            TimelineMonth,
            DragAndDrop,
          ]}
        />
      </ScheduleComponent>
    </>
  );
};

export default TripItinerary;
