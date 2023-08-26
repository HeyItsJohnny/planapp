import React, { useState, useEffect } from "react";

//VISUAL
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
import { parseISO } from "date-fns";

//DATA
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, collection, onSnapshot } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

//EXTRA
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import {
  addToPlanDayCalendar,
  updatePlanDayCalendar,
  deletePlanDayCalendar,
} from "../../globalFunctions/firebaseGlobalFunctions";

const DayCalendar = () => {
  const { dayid } = useParams();
  const { currentSelectedPlan } = useStateContext();

  const [planDay, setPlanDay] = useState({});
  const [planDayCalendar, setPlanDayCalendar] = useState([]);
  const [planDateFormatted, setPlanDateFormatted] = useState("");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());

  const setDayFromURL = async () => {
    try {
      const docRef = doc(db,"plans",currentSelectedPlan,"datedocuments",dayid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlanDay(docSnap.data());
        setPlanDateFormatted(convertDateFormat(docSnap.data().PlanDate));
        setSelectedStartDate(parseISO(docSnap.data().PlanDate));
      }
    } catch (err) {
      alert(err);
    }
  };

  const fetchCalendarData = async () => {
    const docCollection = query(
      collection(db,"plans",currentSelectedPlan,"datedocuments",dayid,"calendar")
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
          Color: "red",
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setPlanDayCalendar(list);
    });
  };

  const addCalendarEvent = async (args) => {
    if (args.requestType === "eventCreated") {
      addToPlanDayCalendar(currentSelectedPlan, dayid, args.addedRecords[0]);
    } else if (args.requestType === "eventChanged") {
      updatePlanDayCalendar(currentSelectedPlan, dayid, args.changedRecords[0]);
    } else if (args.requestType === "eventRemoved") {
      deletePlanDayCalendar(
        currentSelectedPlan,
        dayid,
        args.deletedRecords[0].Id
      );
    }
  };

  useEffect(() => {
    setDayFromURL();
    fetchCalendarData();
    return () => {
      setPlanDay([]);
      setPlanDayCalendar([]);
    };
  }, []);

  return (
    <>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-800">
          <div className="flex justify-between items-center gap-2 mb-10">
            <button
              type="button"
              className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
            >
              <p className="text-xl font-semibold">Calendar</p>
            </button>
          </div>
          <ScheduleComponent
            currentView="Day"
            height="650px"
            eventSettings={{ dataSource: planDayCalendar }}
            actionComplete={addCalendarEvent}
            selectedDate={selectedStartDate || new Date()}
          >
            <Inject
              services={[
                Day,
                Week,
                WorkWeek,
                Month,
                Agenda,
                Resize,
                DragAndDrop,
              ]}
            />
          </ScheduleComponent>
        </div>
    </>
  );
};

export default DayCalendar;
