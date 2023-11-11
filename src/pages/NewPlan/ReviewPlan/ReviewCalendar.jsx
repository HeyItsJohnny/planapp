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
import { useStateContext } from "../../../contexts/ContextProvider";

import { addNewTripPlan } from "../../../globalFunctions/firebaseFunctions";
import { useAuth } from "../../../contexts/AuthContext";
import {
  convertDateFormat2,
  convertDateTimeString,
} from "../../../globalFunctions/globalFunctions";
import { useNavigate } from "react-router-dom";

const ReviewCalendar = ({ detailsData, itinerary, sitesData, mealsData, lodgingData }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const { currentColor } = useStateContext();
  const scheduleRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

  const savePlan = () => {
    if (scheduleRef.current) {
      //Add new trip plan
      addNewTripPlan(currentUser.uid,detailsData,sitesData,mealsData,lodgingData);
      navigate("/");
    }
  };

  return (
    <>
      <button
        type="button"
        style={{
          backgroundColor: currentColor,
          color: "White",
          borderRadius: "10px",
        }}
        className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
        onClick={savePlan}
      >
        Save Plan
      </button>
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
