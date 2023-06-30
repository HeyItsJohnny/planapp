import React, { useState, useEffect } from "react";
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
import useMediaQuery from "@mui/material/useMediaQuery";

import { Box, TextField } from "@mui/material";

import { db } from "../../firebase/firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const PlanSchedule = ({ planid }) => {
  const [planCalendarEvents, setPlanCalendarEvents] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarView, setCalendarView] = useState("Week");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [plan, setPlan] = useState({});

  //Fetch Data -
  const fetchPlan = async () => {
    try {
      const docRef = doc(db, "familyplans", planid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setStartDate(docSnap.data().StartDate);
        setEndDate(docSnap.data().EndDate);
        setCalendarViewComponents(
          docSnap.data().StartDate,
          docSnap.data().EndDate
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  const fetchData = async () => {
    const docCollection = query(
      collection(db, "familyplans", planid, "calendarevents")
    );
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
          Color: "red",
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setPlanCalendarEvents(list);
    });
  };
  //Fetch Data +

  //Event Functions -
  const addEvent = async (args) => {
    if (args.requestType === "eventCreated") {
      try {
        const docRef = await addDoc(
          collection(db, "familyplans", planid, "calendarevents"),
          {
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
          }
        );
      } catch (error) {
        alert("Error adding data to Database: " + error);
      }
    } else if (args.requestType === "eventChanged") {
      try {
        const calendarEventsRef = doc(
          db,
          "familyplans",
          planid,
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
        await deleteDoc(
          doc(
            db,
            "familyplans",
            planid,
            "calendarevents",
            args.deletedRecords[0].Id
          )
        );
      } catch (error) {
        alert("Error deleting data from Database: " + error);
      }
    }
  };
  //Event Functions +

  const setCalendarViewComponents = (startDate, endDate) => {
    if (startDate === endDate) {
      setCalendarView("Day");
    } else {
      setCalendarView("Week");
    }

    setSelectedStartDate(parseISO(startDate));
  };

  //Start & End Dates -
  const onChangeStartDate = (args) => {
    setStartDate(args.target.value);
    setCalendarViewComponents(args.target.value, endDate);
    updateStartDate(args.target.value);
  };

  const onChangeEndDate = (args) => {
    setEndDate(args.target.value);
    setCalendarViewComponents(startDate, args.target.value);
    updateEndDate(args.target.value);
  };

  const updateStartDate = async (start) => {
    try {
      const familyPlansRef = doc(db, "familyplans", planid);
      await updateDoc(familyPlansRef, {
        StartDate: start,
      });
    } catch (error) {
      alert("Error editing data to Database: " + error);
    }
  };

  const updateEndDate = async (end) => {
    try {
      const familyPlansRef = doc(db, "familyplans", planid);
      await updateDoc(familyPlansRef, {
        EndDate: end,
      });
    } catch (error) {
      alert("Error editing data to Database: " + error);
    }
  };
  //Start & End Dates +

  useEffect(() => {
    fetchPlan();
    fetchData();
    return () => {
      setPlanCalendarEvents([]);
    };
  }, []);

  return (
    <>
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        <TextField
          InputLabelProps={{ shrink: true }}
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
        />
        <TextField
          InputLabelProps={{ shrink: true }}
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
        />
      </Box>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
        <ScheduleComponent
          currentView={calendarView}
          height="650px"
          eventSettings={{ dataSource: planCalendarEvents }}
          actionComplete={addEvent}
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

export default PlanSchedule;
