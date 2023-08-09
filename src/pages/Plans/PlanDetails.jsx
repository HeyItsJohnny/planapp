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

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, collection, onSnapshot } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  updatePlanStartDate,
  updatePlanEndDate,
  addToPlanCalendar,
  updatePlanCalendar,
  deletePlanCalendar
} from "../../globalFunctions/firebaseGlobals";

const PlanDetails = () => {
  const { currentSelectedPlan } = useStateContext();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  
  //Itinerary
  const [planCalendar, setPlanCalendar] = useState([]);
  const [calendarView, setCalendarView] = useState("Week");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());

  const [plan, setPlan] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setStartDate(docSnap.data().StartDate);
        setEndDate(docSnap.data().EndDate);
        setCalendarViewComponents(docSnap.data().StartDate,docSnap.data().EndDate);
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

  const onChangeStartDate = (args) => {
    setStartDate(args.target.value);
    setCalendarViewComponents(args.target.value, endDate);
    updatePlanStartDate(currentSelectedPlan, args.target.value);
  };

  const onChangeEndDate = (args) => {
    setEndDate(args.target.value);
    setCalendarViewComponents(startDate, args.target.value);
    updatePlanEndDate(currentSelectedPlan, args.target.value);
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
      addToPlanCalendar(currentSelectedPlan,args.addedRecords[0]);
    } else if (args.requestType === "eventChanged") {
      updatePlanCalendar(currentSelectedPlan,args.changedRecords[0]);
    } else if (args.requestType === "eventRemoved") {
      deletePlanCalendar(currentSelectedPlan,args.deletedRecords[0].Id);
    }
  }

  useEffect(() => {
    setPlanFromContext();
    fetchCalendarData();
    return () => {
      setPlan([]);
      setPlanCalendar([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Plan Details" title={plan.Name} />
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            InputLabelProps={{
              shrink: true,
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
            margin="dense"
            required
            id="StartDate"
            label="Start Date"
            type="date"
            fullWidth
            variant="filled"
            value={startDate}
            onChange={onChangeStartDate}
            sx={{ gridColumn: "span 2" }}
            InputProps={{
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
          />
          <TextField
            InputLabelProps={{
              shrink: true,
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
            margin="dense"
            required
            id="EndDate"
            label="End Date"
            type="date"
            fullWidth
            variant="filled"
            value={endDate}
            onChange={onChangeEndDate}
            sx={{ gridColumn: "span 2" }}
            InputProps={{
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
          />
        </Box>
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
            services={[Day, Week, WorkWeek, Agenda, Resize, DragAndDrop]}
          />
        </ScheduleComponent>
      </div>
    </>
  );
};

export default PlanDetails;
