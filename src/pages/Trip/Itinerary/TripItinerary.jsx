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

//Functions
import { useParams } from "react-router-dom";
import { getTripData } from "../../../globalFunctions/firebaseGETFunctions";
import { useAuth } from "../../../contexts/AuthContext";
import { parseISO } from "date-fns";
import { createNewTripCalendarDoc, updateTripCalendarDoc, deleteTripCalendarDoc } from "../../../globalFunctions/firebaseFunctions";
import GenerateItinerary from "./GenerateItinerary";

//Firebase
import { db } from "../../../firebase/firebase";
import { onSnapshot, query, collection } from "firebase/firestore";

const TripItinerary = () => {
  
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);
  const [calendarView, setCalendarView] = useState("Week");

  const fetchCalendarData = async () => {
    try {
      const docCollection = query(collection(db,"userprofile",currentUser.uid,"trips",tripid,"itinerary"));
      onSnapshot(docCollection, (querySnapshot) => {
        const list = [];
        var itemCount = 1;
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
          itemCount += 1;
        });
        setCalendarData(list);
      });
    } catch(e) {
      alert(e)
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
    } else if (args.requestType === "eventChanged") {
      updateTripCalendarDoc(currentUser.uid, tripid, args.changedRecords[0]);
    } else if (args.requestType === "eventRemoved") {
      deleteTripCalendarDoc(currentUser.uid, tripid, args.deletedRecords[0].Id);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    setTripFromURL();
    return () => {};
  }, []);

  return (
    <>
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
