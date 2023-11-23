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
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, onSnapshot, collection } from "firebase/firestore";
import { parseISO } from "date-fns";
import { createNewTripCalendarDoc, updateTripCalendarDoc, deleteTripCalendarDoc } from "../../globalFunctions/firebaseFunctions";

const TripItinerary = ({ trip }) => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [calendarView, setCalendarView] = useState("Week");

  const fetchCalendarData = async () => {
    const docCollection = query(
      collection(
        db,
        "userprofile",
        currentUser.uid,
        "trips",
        tripid,
        "itinerary"
      )
    );
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          Id: doc.id,
          Subject: doc.data().Subject,
          Location: doc.data().Location,
          Description: doc.data().Description,
          StartTime: doc.data().StartTime.toDate(),
          EndTime: doc.data().EndTime.toDate(),
          IsAllDay: doc.data().IsAllDay,
          RecurrenceRule: doc.data().RecurrenceRule,
          RecurrenceException: doc.data().RecurrenceException,
          Color: "green",
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setCalendarData(list);
    });
  };

  const setTripFromURL = async () => {
    try {
      const docRef = doc(db, "userprofile", currentUser.uid, "trips", tripid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedStartDate(parseISO(docSnap.data().StartDate));
        if (docSnap.data().StartDate === docSnap.data().EndDate) {
          setCalendarView("Day")
        } else {
          setCalendarView("Week")
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
