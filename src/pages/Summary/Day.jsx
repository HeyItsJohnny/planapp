import React, { useState, useEffect } from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { AiTwotoneDelete } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { deleteDayDocument } from "../../globalFunctions/firebaseGlobalFunctions";
import { getDayOfTheWeek } from "../../globalFunctions/globalFunctions";

const Day = ({ day }) => {
  const navigate = useNavigate();
  const { currentColor, currentSelectedPlan } = useStateContext();

  const handleDetails = () => {
    navigate("/daydocument/" + day.id);
  };

  const handleDeleteDate = async () => {
    deleteDayDocument(currentSelectedPlan, day.id);
  };

  return (
    <>
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between items-center ">
          <div>
            <p className="font-bold text-gray-400">{getDayOfTheWeek(day.PlanDate)}</p>
            <p className="text-l">{day.PlanDate}</p>
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
            onClick={handleDeleteDate}
          >
            <AiTwotoneDelete />
          </button>
        </div>
      </div>
    </>
  );
};

export default Day;
