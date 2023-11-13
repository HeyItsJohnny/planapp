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
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, onSnapshot, collection } from "firebase/firestore";
import { parseISO } from "date-fns";

const TripItinerary = ({ trip }) => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState([]);

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
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    setTripFromURL();
    return () => {};
  }, []);

  return (
    <>
      <ScheduleComponent
        currentView="Week"
        height="650px"
        eventSettings={{
          dataSource: calendarData,
        }}
        //actionComplete={addEvent}
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
