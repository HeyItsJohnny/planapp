import React, { useState, useEffect, useRef } from "react";
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

import {
  convertDateFormat2,
  convertDateTimeString,
} from "../../../globalFunctions/globalFunctions";

const ReviewCalendar = ({ detailsData, itinerary }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const scheduleRef = useRef(null);

  const generateItinerary = async () => {
    var tmpArray = [];
    var TempID = 0;
    itinerary.forEach(function (item) {
      const StartTime = convertDateTimeString(
        convertDateFormat2(item.day),
        item.start_time
      );
      const EndTime = convertDateTimeString(
        convertDateFormat2(item.day),
        item.end_time
      );
      var newObj = {
        CategoryColor: "",
        Description: "",
        EndTime: EndTime,
        EventColor: "",
        IsAllDay: false,
        Location: "",
        RecurrenceException: "",
        RecurrenceRule: "",
        StartTime: StartTime,
        Subject: item.activity,
        DocID: TempID,
      };
      tmpArray.push(newObj);
      TempID += 1;
    });
    setCalendarEvents(tmpArray);
  };

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

  useEffect(() => {
    generateItinerary();
    return () => {
      setCalendarEvents([]);
    };
  }, []);

  const getEventsAsJSON = () => {
    if (scheduleRef.current) {
      const events = scheduleRef.current.getEvents();
      console.log(events);
      const eventsJSON = JSON.stringify(events);
      console.log(eventsJSON);
    }
  };

  return (
    <>
      <button onClick={getEventsAsJSON}>SAVE</button>
      <ScheduleComponent
        ref={scheduleRef}
        currentView="Week"
        height="650px"
        eventSettings={{
          dataSource: calendarEvents,
        }}
        actionComplete={addEvent}
        selectedDate={new Date(detailsData.StartDate)}
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

export default ReviewCalendar;
