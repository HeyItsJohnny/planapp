import React, { useState, useEffect } from "react";

//Visual
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import AddFoodToCalendarModal from "../../modals/AddFoodToCalendarModal";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

import {
  deletePlanDayCalendar,
  addEventToCalendar,
} from "../../globalFunctions/firebaseGlobalFunctions";

import {
  convertTo12HourFormat,
  convertDateTimeString,
} from "../../globalFunctions/globalFunctions";

import { useParams } from "react-router-dom";

//Chat GPT
import { Configuration, OpenAIApi } from "openai";

const DayFood = () => {
  const { currentSelectedPlan, currentColor } = useStateContext();
  const { dayid } = useParams();
  //Calendar Settings
  const [restaurants, setRestaurants] = useState([]);
  const [plan, setPlan] = useState({});

  //Chat GPT -
  const configuration = new Configuration({
    
  });
  const openai = new OpenAIApi(configuration);
  //Chat GPT +

  //Loaders
  let [loading, setLoading] = useState(false);

  const getPlan = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
      }
    } catch (err) {
      alert(err);
    }
  };

  const addEverydayCalendarEvent = async (item) => {
    /*
    deletePlanDayCalendar(
      currentSelectedPlan,
      dayid,
      item.CalendarEvent + "_" + planDay.PlanDate
    );
    const StartDateTime = convertDateTimeString(
      planDay.PlanDate,
      item.StartTime
    );
    const EndDateTime = convertDateTimeString(planDay.PlanDate, item.EndTime);
    addEventToCalendar(
      currentSelectedPlan,
      StartDateTime,
      EndDateTime,
      dayid,
      item.CalendarEvent + "_" + planDay.PlanDate,
      item.CalendarEvent
    );
    */
    toast("Added to calendar.");
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setRestaurants([]);
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being restaurants, properties: cuisine, name, yelp rating, yelp link and restaurant address and no line breaks. Please limit to 5 restaurants.",
          },
          {
            role: "user",
            content:
              "Give me the top places to eat in " + plan.Destination + "?",
          },
        ],
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response);
      const returnText = response.data.choices[0].message.content.replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
      const jsonObject = JSON.parse(returnText);
      console.log(jsonObject.restaurants);
      setRestaurants(jsonObject.restaurants);
      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
    }
  };

  useEffect(() => {
    /*
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    },5000)
    */
    getPlan();
    return () => {
      setRestaurants([]);
      setPlan({});
    };
  }, []);

  return (
    <>
      <ToastContainer />
      <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
        <div>
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Select Food Spots</p>
            <button
              type="button"
              style={{
                backgroundColor: currentColor,
                color: "White",
                borderRadius: "10px",
              }}
              className={`text-md p-3 hover:drop-shadow-xl`}
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
          <div className="mt-5 w-72 md:w-400">
            {loading ? (
              <div className="flex justify-between items-center gap-2">
                <ClipLoader
                  color="#ffffff"
                  loading={loading}
                  size={150}
                  aria-label="Loading Spinner"
                  data-testid="loader"
                />
              </div>
            ) : (
              restaurants.map((item) => (
                <div key={item.id} className="flex justify-between mt-4">
                  <div className="flex gap-4">
                    <AddFoodToCalendarModal item={item} dayid={dayid}/>
                    <div>
                      <a href={item["yelp link"]} target="_blank">
                        <p className="text-md font-semibold">{item.name}</p>
                        <p className="text-md font-semibold">{item.cuisine}</p>
                      </a>
                    </div>
                  </div>
                  <p>Stars: {item["yelp rating"]}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DayFood;
