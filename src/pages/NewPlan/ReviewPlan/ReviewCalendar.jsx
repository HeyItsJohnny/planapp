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
  TimelineMonth,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

import { convertDateFormat2, convertDateTimeString } from "../../../globalFunctions/globalFunctions";

const ReviewCalendar = ({ detailsData, itinerary }) => {
  const [calendarEvents, setCalendarEvents] = useState([]);

  const generateItinerary = async () => {
    var tmpArray = [];

    itinerary.forEach(function (item) {
      const StartTime = convertDateTimeString(convertDateFormat2(item.day), item.start_time);
      const EndTime = convertDateTimeString(convertDateFormat2(item.day), item.end_time);

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
      };
      tmpArray.push(newObj);
    });
    setCalendarEvents(tmpArray);
  };

  const addEvent = async (args) => {
    //console.log(args);
    if (args.requestType === "eventCreated") {
      //setCalendarEvents(prevArray => [...prevArray, args.addedRecords[0]]);
      //addToFamilyCalendar(currentUser.uid,args.addedRecords[0],"FamilyCalendar");
    } else if (args.requestType === "eventChanged") {
      //updateFamilyCalendar(currentUser.uid, args.changedRecords[0]);
    } else if (args.requestType === "eventRemoved") {
      //deleteFamilyCalendar(currentUser.uid, args.deletedRecords[0].Id);
    }
    //console.log(calendarEvents);
  };

  useEffect(() => {
    generateItinerary();
    return () => {
      setCalendarEvents([]);
    };
  }, []);

  return (
    <ScheduleComponent
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
  );
};

export default ReviewCalendar;
