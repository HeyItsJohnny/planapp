import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Header } from "../../../components";
import {
  getDatesBetween,
  formatDataIntoString,
  convertDateTimeString,
  convertDateFormat2,
} from "../../../globalFunctions/globalFunctions";

import {
  getChatActivities,
  getChatRestaurants,
  getChatItinerary,
} from "../../../globalFunctions/chatGPTFunctions";

//Components
import NewTripItinerary from "./NewTripItinerary";
import NewTripMeals from "./NewTripMeals";
import NewTripActivities from "./NewTripActivies";

const NewTripConfirmation = ({ tripDetails, tripTimeDetails }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const [activities, setActivities] = useState([]);
  const [meals, setMeals] = useState([]);
  const [itineraryData, setItineraryData] = useState([]);

  const getAIGeneratedItinerary = async (testActivities, testMeals) => {
    setProgressText("Creating Itinerary..");
    const activityString = formatDataIntoString(testActivities);
    const mealString = formatDataIntoString(testMeals);
    const chatGPTItinerary = await getChatItinerary(
      tripDetails,
      activityString,
      mealString,
      tripTimeDetails.WakeUpTime,
      tripTimeDetails.BedTime
    );
    //console.log(chatGPTItinerary.itinerary);
    generateItinerary(chatGPTItinerary.itinerary);
    //Iterate through itinerary and create itinerary Data
    setProgress(100);
    setLoading(false);
  };

  const generateItinerary = async (itineraryData) => {    
    var tmpArray = [];
    var TempID = 0;
    itineraryData.forEach(function (item) {
    const DateFormat = convertDateFormat2(item.day);
      const StartTime = convertDateTimeString(
        DateFormat,
        item.start_time
      );
      const EndTime = convertDateTimeString(
        DateFormat,
        item.end_time
      );
      var newObj = {
        CategoryColor: "",
        Description: "",
        EndTime: EndTime,
        EventColor: "",
        IsAllDay: false,
        Location: "",
        RecurrenceException: "",
        RecurrenceRule: "",
        StartTime: StartTime,
        Subject: item.activity,
        DocID: TempID,
      };
      tmpArray.push(newObj);
      TempID += 1;
    });
    console.log(tmpArray);
    setItineraryData(tmpArray);
  };

  const getNumberOfDays = () => {
    const daysbetween = getDatesBetween(
      tripDetails.StartDate,
      tripDetails.EndDate
    );
    return daysbetween.length;
  };

  useEffect(() => {
    const runProcessFunctions = async () => {
      try {
        setProgressText("Searching for Activities..");
        const chatGPTActivities = await getChatActivities(
          tripDetails.Destination,
          tripDetails.Category,
          getNumberOfDays()
        );
        setActivities(chatGPTActivities.activities);
        setProgress(25);
        setProgressText("Searching for Meals..");
        const chatGPTRestaurants = await getChatRestaurants(
          tripDetails.Destination,
          getNumberOfDays()
        );
        setMeals(chatGPTRestaurants.restaurants);
        setProgress(50);
        await getAIGeneratedItinerary(
          chatGPTActivities.activities,
          chatGPTRestaurants.restaurants
        );
      } catch (error) {
        alert("ERROR: " + error);
      }
    };

    runProcessFunctions();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
          <h1 className="mb-2">
            Please wait, your next vacation is being created.
          </h1>
          <h1 className="mb-20">{progressText}</h1>
          <LinearProgress variant="determinate" value={progress} />
          <div>{`${Math.round(progress)}%`}</div>
        </div>
      ) : (
        <>
          <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
            <Header category="" title="Itinerary" />
            <NewTripItinerary
              itineraryData={itineraryData}
              startDate={tripDetails.StartDate}
            />
          </div>
          <div className="flex gap-10 flex-wrap justify-center">
            <div className="flex gap-10 flex-wrap justify-center">
              <NewTripActivities />
              <NewTripMeals />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewTripConfirmation;
