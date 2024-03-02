import React, { useState, useEffect, useRef } from "react";

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

//import { convertDateTimeString, convertDateFormat2 } from "../../../globalFunctions/globalFunctions";

const NewTripItinerary = ({ itineraryData, startDate }) => {
  const [calendarView, setCalendarView] = useState("Week");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const scheduleRef = useRef(null);

  const addEvent = async (args) => {
    if (args.requestType === "eventCreated") {
      //Not needed but it is item created
    } else if (args.requestType === "eventChanged") {
      //updateFamilyCalendar(currentUser.uid, args.changedRecords[0]);

      const updatedEvent = args.changedRecords[0];
      const updatedEvents = calendarEvents.map((event) => {
        if (event.DocID === updatedEvent.DocID) {
          // Update properties of the event with the specific ID
          return {
            ...event,
            Subject: updatedEvent.Subject,
            StartTime: updatedEvent.StartTime,
            EndTime: updatedEvent.EndTime,
          };
        }
        return event;
      });
      setCalendarEvents(updatedEvents);
    } else if (args.requestType === "eventRemoved") {
      const deletedEventId = args.deletedRecords[0].DocID; // Assuming there's an 'Id' property in your events
      const updatedEvents = calendarEvents.filter(
        (event) => event.DocID !== deletedEventId
      );
      setCalendarEvents(updatedEvents);
    }
  };

  const savePlan = () => {
    /*if (scheduleRef.current) {
      //Add new trip plan
      const itineraryData = scheduleRef.current.getCurrentViewEvents();
      addNewTripPlan(currentUser.uid,detailsData,sitesData,mealsData,lodgingData,itineraryData);
      navigate("/");
    }*/
  };

  useEffect(() => {
    //generateItinerary();
    //setCalendarEvents(itineraryData);
    return () => {
      //setCalendarEvents([]);
    };
  }, []);

  return (
    <>
      <ScheduleComponent
        ref={scheduleRef}
        currentView={calendarView}
        height="650px"
        eventSettings={{
          dataSource: itineraryData,
        }}
        actionComplete={addEvent}
        selectedDate={startDate}
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

export default NewTripItinerary;
