import React, { useState, useEffect } from "react";

import { useStateContext } from "../../contexts/ContextProvider";

//Data
import { db } from "../../firebase/firebase";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";

//EXTRA
import { convertDateFormat } from "../../globalFunctions/globalFunctions";
import Day from "./Day";

const Days = () => {
  const { currentSelectedPlan } = useStateContext();
  const [planDays, setPlanDays] = useState([]);

  const fetchPlanDaysData = async () => {
    try {
      const docCollection = query(
        collection(db, "plans", currentSelectedPlan, "datedocuments"),
        orderBy("PlanDate")
      );
      onSnapshot(docCollection, (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          var data = {
            id: doc.id,
            PlanDate: convertDateFormat(doc.data().PlanDate),
            PlanName: doc.data().PlanName,
          };
          list.push(data);
        });
        setPlanDays(list);
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (currentSelectedPlan !== "") {
      fetchPlanDaysData();
    }
    return () => {
      setPlanDays([]);
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center">
      {planDays.map((day) => (
        <Day day={day} />
      ))}
    </div>
  );
};

export default Days;
