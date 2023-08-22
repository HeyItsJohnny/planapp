import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components/";
import {
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, collection, onSnapshot } from "firebase/firestore";

//EXTRA
import { useStateContext } from "../../contexts/ContextProvider";
import {
  addToPlanCalendar,
  updatePlanCalendar,
  deletePlanCalendar,
} from "../../globalFunctions/firebaseGlobals";
import { parseISO } from "date-fns";

const PlanCalendar = () => {
  const [planCalendar, setPlanCalendar] = useState([]);
  const [calendarView, setCalendarView] = useState("Week");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());

  const { currentSelectedPlan } = useStateContext();

  const fetchCalendarData = async () => {
    const docCollection = query(
      collection(db, "plans", currentSelectedPlan, "calendar")
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
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setPlanCalendar(list);
    });
  };

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCalendarViewComponents(
          docSnap.data().StartDate,
          docSnap.data().EndDate
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  const setCalendarViewComponents = (startDate, endDate) => {
    if (startDate === endDate) {
      setCalendarView("Day");
    } else {
      setCalendarView("Week");
    }
    setSelectedStartDate(parseISO(startDate));
  };

  const addCalendarEvent = async (args) => {
    if (args.requestType === "eventCreated") {
      addToPlanCalendar(currentSelectedPlan, args.addedRecords[0]);
    } else if (args.requestType === "eventChanged") {
      updatePlanCalendar(currentSelectedPlan, args.changedRecords[0]);
    } else if (args.requestType === "eventRemoved") {
      deletePlanCalendar(currentSelectedPlan, args.deletedRecords[0].Id);
    }
  };

  useEffect(() => {
    setPlanFromContext();
    fetchCalendarData();
    return () => {
      setPlanCalendar([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Plan" title="Calendar" />
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <ScheduleComponent
          currentView={calendarView}
          height="650px"
          eventSettings={{ dataSource: planCalendar }}
          actionComplete={addCalendarEvent}
          selectedDate={selectedStartDate || new Date()}
        >
          <Inject
            services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
          />
        </ScheduleComponent>
      </div>
    </>
  );
};

export default PlanCalendar;
