import React from "react";

//VISUAL
import { useStateContext } from "../../../contexts/ContextProvider";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MealComponent = ({ item, addSelectedData }) => {
  const { currentColor } = useStateContext();

  const addRestaurant = () => {
    toast("Restaurant added: " + item.name);
    addSelectedData(item);
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg h-44 rounded-xl w-full lg:w-80 p-8 pt-5 m-3 bg-no-repeat bg-cover bg-center">
        <div className="flex justify-between items-center ">
          <div>
            <a href={item.website} target="_blank">
              <p className="font-bold text-gray-400">{item.name} ({item.category})</p>
            </a>
            <p className="text-l">Stars: {item.review_stars}</p>
          </div>
        </div>
        <div className="mt-2">
          <button
            type="button"
            style={{
              backgroundColor: currentColor,
              color: "White",
              borderRadius: "10px",
            }}
            className={`text-md p-3 hover:drop-shadow-xl float-right`}
            onClick={addRestaurant}
          >
            Add
          </button>
        </div>
      </div>
    </>
  );
};

export default MealComponent;
