import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

//Visual
import { Header } from "../../components";
import { Box, TextField } from "@mui/material";
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
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, collection, onSnapshot } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  addToPlanCalendar,
  updatePlanCalendar,
  deletePlanCalendar,
} from "../../globalFunctions/firebaseGlobals";

const PlanActivities = () => {
  const { currentSelectedPlan } = useStateContext();
  const navigate = useNavigate();

  //Itinerary
  const [planCalendar, setPlanCalendar] = useState([]);
  const [calendarView, setCalendarView] = useState("Week");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());

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
          Color: "red",
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setPlanCalendar(list);
    });
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

  const goToCalendarPage = () => {
    navigate("/plancalendar/");
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
        <Header category="Plan" title="Activities" />
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Activities</p>
          </div>
          <div className="mt-5 w-72 md:w-400">
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    color: "#03C9D7",
                    backgroundColor: "#E5FAFB",
                  }}
                  className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                >
                  <IoIosAddCircle />
                </button>
                <div>
                  <p className="text-md font-semibold">Activity 1</p>
                </div>
              </div>
              <p>Time: 60 minutes</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-800">
          <div className="flex justify-between items-center gap-2 mb-10">
            <button
              type="button"
              className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
              onClick={goToCalendarPage}
            >
              <p className="text-xl font-semibold">Calendar</p>
            </button>
          </div>
          <ScheduleComponent
            currentView={calendarView}
            height="650px"
            eventSettings={{ dataSource: planCalendar }}
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
      </div>
    </>
  );
};

export default PlanActivities;
