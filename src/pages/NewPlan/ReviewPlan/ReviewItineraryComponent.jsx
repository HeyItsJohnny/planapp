import React, { useEffect, useState } from "react";

//Visual
import ClipLoader from "react-spinners/ClipLoader";
import ReviewCalendar from "./ReviewCalendar";

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

  //Chat GPT -
  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);
  //Chat GPT +

  const getAIGeneratedItinerary = async () => {
    try {
      setLoading(true);
      setItinerary([]);

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being itinerary, properties: day, start_time, end_time, activity.",
          },
          {
            role: "user",
            content:
              "Please create an itinerary for me that is structured with a breakfast, an activity, lunch, another activity and dinner. I will be staying in Seattle, WA from 11/7/2023 to 11/9/2023 at Hilton Garden Inn 1821 Boren Ave Seattle, WA 98101." +
              "Please fill in my itinerary with opportunities to relax. Please do not duplicate my visits. Also please have the start_time and end_time in a 24 hour format." +
              "I want to visit the space needle, the seattle great wheel and the seattle aquarium. I want to eat at Pike Place Chowder, Beecher's Handmade Cheese and the crab pot.",
          },
        ],
        temperature: 0,
        //max_tokens: 1024,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
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
        <ReviewCalendar detailsData={detailsData} itinerary={itinerary}/>
      )}
    </>
  );
};

export default ReviewItineraryComponent;
