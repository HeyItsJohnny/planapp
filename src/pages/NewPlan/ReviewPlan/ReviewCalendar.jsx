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
    console.log(tmpArray);
    setCalendarEvents(tmpArray);
  };

  useEffect(() => {
    generateItinerary();
    return () => {
      //setCalendarEvents([]);
    };
  }, []);

  return (
    <ScheduleComponent
      currentView="Week"
      height="650px"
      eventSettings={{
        dataSource: calendarEvents,
      }}
      selectedDate={new Date()}
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
