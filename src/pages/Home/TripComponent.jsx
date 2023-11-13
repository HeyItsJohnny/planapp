import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { AiTwotoneDelete } from "react-icons/ai";
import { TbListDetails } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { convertDateFormat } from "../../globalFunctions/globalFunctions";

const TripComponent = ({ trip }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  const handleDetails = () => {
    navigate("/trip/" + trip.id);
  };

  const handleDeletePlan = async () => {
    alert("Delete Trip");
  };

  return (
    <>
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-5 m-3 bg-no-repeat bg-cover bg-center"> 
        <div className="flex justify-between items-center ">
          <div>
            <p className="font-bold text-gray-400">{trip.Destination}</p>
            <p className="text-l">{convertDateFormat(trip.StartDate)} - {convertDateFormat(trip.EndDate)}</p>
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

export default TripComponent;
