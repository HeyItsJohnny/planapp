import React, { useState, useEffect } from "react";
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
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";

import { Header } from "../components";

import { db } from "../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const Calendar = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);

  const fetchData = async () => {
    const docCollection = query(collection(db, "calendarevents"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      const IDLogger = 1;
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
          Color: 'red',
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setCalendarEvents(list);
    });
  };

  const addEvent = async (args) => {
    if (args.requestType === "eventCreated") {
      try {
        const docRef = await addDoc(collection(db, "calendarevents"), {
          Subject: args.addedRecords[0].Subject,
          Location: args.addedRecords[0].Location ?? "",
          Description: args.addedRecords[0].Description ?? "",
          StartTime: args.addedRecords[0].StartTime ?? "",
          EndTime: args.addedRecords[0].EndTime ?? "",
          IsAllDay: args.addedRecords[0].IsAllDay ?? "",
          RecurrenceRule: args.addedRecords[0].RecurrenceRule ?? "",
          RecurrenceException: args.addedRecords[0].RecurrenceException ?? "",
          CategoryColor: args.addedRecords[0].CategoryColor ?? "",
          EventColor: args.addedRecords[0].EventColor ?? "",
        });
      } catch (error) {
        alert("Error adding data to Database: " + error);
      }
    } else if (args.requestType === "eventChanged") {
      try {
        const calendarEventsRef = doc(
          db,
          "calendarevents",
          args.changedRecords[0].Id
        );
        await updateDoc(calendarEventsRef, {
          Subject: args.changedRecords[0].Subject,
          Location: args.changedRecords[0].Location ?? "",
          Description: args.changedRecords[0].Description ?? "",
          StartTime: args.changedRecords[0].StartTime ?? "",
          EndTime: args.changedRecords[0].EndTime ?? "",
          IsAllDay: args.changedRecords[0].IsAllDay ?? "",
          RecurrenceRule: args.changedRecords[0].RecurrenceRule ?? "",
          RecurrenceException: args.changedRecords[0].RecurrenceException ?? "",
          CategoryColor: args.changedRecords[0].CategoryColor ?? "",
          EventColor: args.changedRecords[0].EventColor ?? "",
        });
      } catch (error) {
        alert("Error editing data to Database: " + error);
      }
    } else if (args.requestType === "eventRemoved") {
      try {
        await deleteDoc(doc(db, "calendarevents", args.deletedRecords[0].Id));
      } catch (error) {
        alert("Error deleting data from Database: " + error);
      }
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      setCalendarEvents([]); // This worked for me
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        currentView="Week"
        height="650px"
        eventSettings={{ dataSource: calendarEvents }}
        actionComplete={addEvent}
      >
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </div>
  );
};

export default Calendar;
