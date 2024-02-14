import React, { useState, useEffect } from "react";

//Visual
import { AiTwotoneDelete } from "react-icons/ai";
import NewTripMealModal from "./Modals/NewTripMealModal";
import AITripMealModal from "./Modals/AITripMealModal";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Functions
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTripMealData } from "../../globalFunctions/firebaseGETFunctions";
import { deleteActivityMealDoc } from "../../globalFunctions/firebaseFunctions";

const TripMeals = () => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [tripMeals, setTripMeals] = useState([]);

  const fetchTripMealsData = async () => {
    const data = await getTripMealData(currentUser.uid,tripid);
    setTripMeals(data)
  };

  const removeMeal = (meal) => {
    deleteActivityMealDoc(currentUser.uid, tripid, meal.id, "meals");
    toast(meal.name + " removed from my list.");
  };

  useEffect(() => {
    fetchTripMealsData();
    return () => {
      setTripMeals([]);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Meals</p>
        </div>
        <div className="mt-5 mb-5 w-72 md:w-400">
          {tripMeals.map((meal) => (
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <div>
                  <a href={meal.website} target="_blank">
                    <p className="text-md font-semibold">{meal.name}</p>
                  </a>
                  <p className="text-sm text-gray-400">{meal.category}</p>
                </div>
              </div>
              <button
                type="button"
                style={{
                  backgroundColor: "#FF0000",
                  color: "White",
                }}
                className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                onClick={() => removeMeal(meal)}
              >
                <AiTwotoneDelete />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center gap-2">
          <AITripMealModal />
          <div className="w-28 px-14 py-1 rounded-md">
            <NewTripMealModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripMeals;
