import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components";

//DATA
import { useParams } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

//EXTRA
import { convertDateFormat } from "../../globalFunctions/globalFunctions";

const Day = () => {
  const { dayid } = useParams();
  const { currentSelectedPlan } = useStateContext();

  const [planDay, setPlanDay] = useState({});

  const setDayFromURL = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan, "datedocuments", dayid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlanDay(docSnap.data());
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    console.log("Get From URL: ");
    setDayFromURL();
    return () => {
      setPlanDay([]);
    };
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Plan" title={planDay.PlanDate} />
    </div>
  );
};

export default Day;
