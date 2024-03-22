import React, { useState, useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Header } from "../../components";
import {
  getDatesBetween,
  formatDataIntoString,
  convertDateTimeString,
  convertDateFormat2,
} from "../../globalFunctions/globalFunctions";

import {
  getChatActivitiesPerDay,
  getChatRestaurantsPerDay,
  getChatActivities,
  getChatRestaurants,
  getChatItinerary,
} from "../../globalFunctions/chatGPTFunctions";
import { addNewTripPlan, addSavedActivitiesToTrip, addSavedMealsToTrip } from "../../globalFunctions/firebaseFunctions";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const NewTripConfirmation = ({ tripDetails, tripTimeDetails }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const { currentUser } = useAuth();

  const getFinalizeTrip = async () => {
    //get Activities, Meals and Itinerary
    setProgressText("Searching for Activities..");
    const chatGPTActivities = await getChatActivities(
      tripDetails.Destination,
      tripDetails.Category,
      getNumberOfDays()
    );
    setProgress(25);
    setProgressText("Searching for Meals..");
    const chatGPTRestaurants = await getChatRestaurants(
      tripDetails.Destination,
      getNumberOfDays()
    );
    setProgress(50);
    await getAIGeneratedItinerary(
      chatGPTActivities.activities,
      chatGPTRestaurants.restaurants
    );
  };

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
    generateItinerary(testActivities, testMeals, chatGPTItinerary.itinerary);
    setProgress(75);
  };

  const generateItinerary = async (activityData, mealData, itineraryData) => {
    var tmpArray = [];
    var TempID = 0;
    itineraryData.forEach(function (item) {
      const DateFormat = convertDateFormat2(item.day);
      const StartTime = convertDateTimeString(DateFormat, item.start_time);
      const EndTime = convertDateTimeString(DateFormat, item.end_time);
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
    createNewTrip(activityData, mealData, tmpArray);
  };

  const createNewTrip = async (activityData, mealData, itineraryData) => {
    setProgressText("Creating Your Trip..");
    const newTripId = await addNewTripPlan(
      currentUser.uid,
      tripDetails,
      tripTimeDetails,
      activityData,
      mealData,
      itineraryData
    );
    //navigate("/trip/" + newTripId);
    setProgress(0);
  };

  const getNumberOfDays = () => {
    const daysbetween = getDatesBetween(
      tripDetails.StartDate,
      tripDetails.EndDate
    );
    return daysbetween.length;
  };

  const getTheDays = async () => {
    const tripdays = getDatesBetween(
      tripDetails.StartDate,
      tripDetails.EndDate
    );

    const activitiesArray = [];
    const mealsArray = [];

    //Create new trip
    /*
    const newTripId = await createNewTrip(
      currentUser.uid,
      tripDetails,
      tripTimeDetails,
    );
    console.log(newTripId);
    */

    await tripdays.forEach(async (value, index) => {
      //console.log(`Number at index ${index}: ${value}`);
      console.log("Index: " + index);
      //Get Chat CPT Activities
      const chatGPTActivities = await getChatActivitiesPerDay(
        tripDetails.Destination,
        tripDetails.Category,
        formatDataIntoString(activitiesArray)
      );
      activitiesArray.push(chatGPTActivities);
      console.log(chatGPTActivities);

      //Save Activities
      //addSavedActivitiesToTrip(currentUser.uid, newTripId, chatGPTActivities);

      //Get Chat GPT Regular Meals
      const chatGPTMeals = await getChatRestaurantsPerDay(
        tripDetails.Destination,
        formatDataIntoString(mealsArray)
      );
      mealsArray.push(chatGPTMeals);
      console.log(chatGPTMeals);
      //Save Meals
      //addSavedMealsToTrip(currentUser.uid, newTripId, chatGPTMeals);  

      //Get Chat GPT Regular Itinerary
      //Save Itinerary
    })
    setProgress(100);
  };

  const getAllActivties = async () => {
    const chatGPTActivities = await getChatActivitiesPerDay(
      tripDetails.Destination,
      tripDetails.Category
    );
    return chatGPTActivities
  }

  useEffect(() => {
    const runProcessFunctions = async () => {
      try {
        //getFinalizeTrip();
        getTheDays();
      } catch (error) {
        alert("ERROR: " + error);
      }
    };
    runProcessFunctions();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <h1 className="mb-2">
        Please wait, your next vacation is being created.
      </h1>
      <h1 className="mb-20">{progressText}</h1>
      <LinearProgress variant="determinate" value={progress} />
      <div>{`${Math.round(progress)}%`}</div>
    </div>
  );
};

export default NewTripConfirmation;
