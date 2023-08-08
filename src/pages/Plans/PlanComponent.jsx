import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb";

import { db } from "../../firebase/firebase";
import { doc, deleteDoc } from "firebase/firestore";

import { convertDateFormat } from "../../globalFunctions/globalFunctions";

const PlanComponent = ({ plan }) => {
  const { currentColor } = useStateContext();

  const handleDetails = () => {
    alert("DETAILS");
  };

  const handleDeletePlan = async () => {
    try {
      await deleteDoc(doc(db, "plans", plan.id));
    } catch (error) {
      alert("Error deleting data from Firestore:", error);
    }
  };

  return (
    <>
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-400">{plan.Name}</p>
            <p className="text-l">{convertDateFormat(plan.StartDate)} - {convertDateFormat(plan.EndDate)}</p>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="button"
            style={{
              backgroundColor: currentColor,
              color: "White",
              borderRadius: "10px",
            }}
            className={`text-md p-3 hover:drop-shadow-xl`}
            onClick={handleDetails}
          >
            <TbListDetails />
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#FF0000",
              color: "White",
              borderRadius: "10px",
            }}
            className={`text-md p-3 hover:drop-shadow-xl float-right`}
            onClick={handleDeletePlan}
          >
            <AiTwotoneDelete />
          </button>
        </div>
      </div>
    </>
  );
};

export default PlanComponent;
