import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { Button } from "../../components";
import { MdOutlineSupervisorAccount } from "react-icons/md";

const PlanComponent = ({ plan }) => {
  const { currentColor } = useStateContext();

  const handleDetails = () => {
    alert("DETAILS");
  };

  return (
    <>
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-9 m-3 bg-hero-pattern bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-gray-400">{plan.Name}</p>
            <p className="text-l">01/03/23 - 01/05/23</p>
          </div>
          <button
            type="button"
            style={{ backgroundColor: currentColor }}
            className="text-2xl opacity-0.9 text-white hover:drop-shadow-xl rounded-full  p-4"
          >
            <MdOutlineSupervisorAccount />
          </button>
        </div>
        <div className="mt-6">
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
            Details
          </button>
        </div>
      </div>
    </>
  );
};

export default PlanComponent;
