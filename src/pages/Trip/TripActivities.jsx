import React, { useState, useEffect } from "react";

//Visual
import { AiTwotoneDelete } from "react-icons/ai";
import { useStateContext } from "../../contexts/ContextProvider";
import NewTripActivityModal from "./Modals/NewTripActivityModal";
import AITripActivityModal from "./Modals/AITripActivityModal";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Functions
import { useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getTripActivityData } from "../../globalFunctions/firebaseGETFunctions";
import { deleteActivityMealDoc } from "../../globalFunctions/firebaseFunctions";

const TripActivities = () => {
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [tripActivities, setTripActivities] = useState([]);

  const fetchTripActivityData = async () => {
    const data = await getTripActivityData(currentUser.uid,tripid);
    setTripActivities(data)
  };

  const removeActivity = (activity) => {
    deleteActivityMealDoc(currentUser.uid, tripid, activity.id, "activities");
    toast(activity.name + " removed from my list.");
  };

  useEffect(() => {
    fetchTripActivityData();
    return () => {
      setTripActivities([]);
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div className="flex justify-between items-center gap-2">
          <p className="text-xl font-semibold">Activitites</p>
        </div>
        <div className="mt-5 mb-5 w-72 md:w-400">
          {tripActivities.map((activity) => (
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <div>
                  <a href={activity.website} target="_blank">
                    <p className="text-md font-semibold">{activity.name}</p>
                  </a>
                  <p className="text-sm text-gray-400">
                    Hours: {activity.hours_spent}
                  </p>
                </div>
              </div>
              <button
                type="button"
                style={{
                  backgroundColor: "#FF0000",
                  color: "White",
                }}
                className="text-2xl rounded-lg p-2 hover:drop-shadow-xl"
                onClick={() => removeActivity(activity)}
              >
                <AiTwotoneDelete />
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center gap-2">
          <AITripActivityModal />

          <div className="w-28 px-14 py-1 rounded-md">
            <NewTripActivityModal />
          </div>
        </div>
      </div>
    </>
  );
};

export default TripActivities;
