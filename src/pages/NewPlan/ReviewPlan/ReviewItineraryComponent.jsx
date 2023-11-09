import React, { useEffect, useState } from "react";

//Visual
import ClipLoader from "react-spinners/ClipLoader";
import ReviewCalendar from "./ReviewCalendar";
import { formatDataIntoString } from "../../../globalFunctions/globalFunctions";

//Chat GPT
import { Configuration, OpenAIApi } from "openai";

const ReviewItineraryComponent = ({
  detailsData,
  sitesData,
  mealsData,
  lodgingData,
}) => {
  let [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState([]);
  const [activityString, setActivityString] = useState("");
  const [mealString, setMealString] = useState("");

  //Chat GPT -
  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);
  //Chat GPT +

  const getAIGeneratedItinerary = async () => {
    try {
      var lodgingAddress = "";
      if (lodgingData.Address1 === "") {
        lodgingAddress = ".";
      } else {
        lodgingAddress =
          "at " +
          lodgingData.Name +
          " " +
          lodgingData.Address1 +
          " " +
          lodgingData.City +
          ", " +
          lodgingData.State +
          " " +
          lodgingData.ZipCode +
          ".";
      }

      setLoading(true);
      setItinerary([]);

      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being itinerary, properties: day, start_time, end_time, activity.",
          },
          {
            role: "user",
            content:
              "Please create an itinerary for me that is structured with a breakfast, an activity, lunch, another activity and dinner. I will be staying in " +
              detailsData.Destination +
              " from " +
              detailsData.StartDate +
              " to " +
              detailsData.EndDate +
              lodgingAddress +
              "Please fill in my itinerary with opportunities to relax. Please do not duplicate my visits and have the day format in YYYY-MM-DD. Also please have the start_time and end_time in a 24 hour format." +
              "I want to visit " + activityString + ". I want to eat at " + mealString + ".",
          },
        ],
        temperature: 0,
        //max_tokens: 1024,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      console.log(response.data.choices[0].message.content);
      const returnText = response.data.choices[0].message.content.replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
      const jsonObject = JSON.parse(returnText);
      setItinerary(jsonObject.itinerary);
      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setActivityString(formatDataIntoString(sitesData));
    setMealString(formatDataIntoString(mealsData));
    getAIGeneratedItinerary();
    return () => {
      setItinerary([]);
    };
  }, []);

  return (
    <>
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
        <ReviewCalendar detailsData={detailsData} itinerary={itinerary} />
      )}
    </>
  );
};

export default ReviewItineraryComponent;
