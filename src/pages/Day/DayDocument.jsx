import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components";
import DayCalendar from "./DayCalendar";
import DayEvents from "./DayEvents";

//DATA
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

//EXTRA
import { convertDateFormat, getDayOfTheWeek } from "../../globalFunctions/globalFunctions";

const DayDocument = () => {
  const { dayid } = useParams();
  const { currentSelectedPlan } = useStateContext();

  const [planDay, setPlanDay] = useState({});
  const [planDateFormatted, setPlanDateFormatted] = useState("");

  const setDayFromURL = async () => {
    try {
      const docRef = doc(db,"plans",currentSelectedPlan,"datedocuments",dayid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlanDay(docSnap.data());
        setPlanDateFormatted(convertDateFormat(docSnap.data().PlanDate));
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    setDayFromURL();
    return () => {
      setPlanDay([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category={getDayOfTheWeek(planDateFormatted)} title={planDateFormatted} />
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <DayEvents />
        <DayCalendar />
      </div>
    </>
  );
};

export default DayDocument;
