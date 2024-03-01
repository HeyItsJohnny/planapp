import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Header } from "../../components";

import { getChatActivities, getChatRestaurants } from "../../globalFunctions/chatGPTFunctions";

const NewTripConfirmation = ({tripDetails}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const [activities, setActivities] = useState([]);
  const [meals, setMeals] = useState([]);

  const getAIGeneratedActivities = async () => {
    try {
      setActivities([]);
      setProgressText("Searching for Activities..");
      const chatGPTActivities = await getChatActivities(tripDetails.Destination, tripDetails.Category);
      console.log(chatGPTActivities.activities);
      setActivities(chatGPTActivities.activities);
      setProgress(50);
    } catch (error) {
      alert("ERROR: " + error);
    }
  };

  const getAIGeneratedMeals = async () => {
    try {
      setMeals([]);
      setProgressText("Searching for Meals..");
      const chatGPTRestaurants = await getChatRestaurants(tripDetails.Destination);
      console.log(chatGPTRestaurants.restaurants);
      setMeals(chatGPTRestaurants.restaurants);
      setProgress(100);
      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
    }
  };

  useEffect(() => {
    const runProcessFunctions = async () => {
      try {
        await getAIGeneratedActivities();
        await getAIGeneratedMeals();
      } catch (error) {
        alert("ERROR: " + error);
      }
    };

    runProcessFunctions();

  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      {loading ? (
        <div>
          <h1 className="mb-2">
            Please wait, your vacation is being created.
          </h1>
          <h1 className="mb-20">
            {progressText}
          </h1>
          <LinearProgress variant="determinate" value={progress} />
          <div>{`${Math.round(progress)}%`}</div>
        </div>
      ) : (
        <div>
          <Header category="Confirmation!" title="New Trip" />
          <h1>Welcome to the App!</h1>
          <p>This is the main content of your app.</p>
        </div>
      )}
    </div>
  );
};

export default NewTripConfirmation;
