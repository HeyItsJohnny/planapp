import React, { useState, useEffect } from "react";

//Functions
import { useParams } from "react-router-dom";
import { useStateContext } from "../../../contexts/ContextProvider";
import { formatDataIntoString } from "../../../globalFunctions/globalFunctions";

//Firebase
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../firebase/firebase";
import { getTripData } from "../../../globalFunctions/firebaseGETFunctions";
import { doc, getDoc, onSnapshot, query, collection } from "firebase/firestore";
import { addChatGPTTripData } from "../../../globalFunctions/firebaseFunctions";

//Chat GPT
import { Configuration, OpenAIApi } from "openai";

//Visual
import ClipLoader from "react-spinners/ClipLoader";

const GenerateItinerary = () => {
  const { currentColor } = useStateContext();
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  let [loading, setLoading] = useState(false);

  //Trip Objects
  const [trip, setTrip] = useState({});
  const [lodging, setLodging] = useState({});
  const [itinerary, setItinerary] = useState([]);
  const [activityString, setActivityString] = useState("");
  const [mealString, setMealString] = useState("");

  //Chat GPT -
  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);
  //Chat GPT +

  const generateAIItinerary = async () => {
    try {
      //Delete all Itinerary here
      var lodgingAddress = "";
      if (lodging.Address1 === "") {
        lodgingAddress = ".";
      } else {
        lodgingAddress =
          "at " +
          lodging.Name +
          " " +
          lodging.Address1 +
          " " +
          lodging.City +
          ", " +
          lodging.State +
          " " +
          lodging.ZipCode +
          ".";
      }

      setLoading(true);

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
              trip.Destination +
              " from " +
              trip.StartDate +
              " to " +
              trip.EndDate +
              lodgingAddress +
              "Please fill in my itinerary with opportunities to relax. Please do not duplicate my visits and have the day format in YYYY-MM-DD. Also please have the start_time and end_time in a 24 hour format." +
              "I want to visit " +
              activityString +
              ". I want to eat at " +
              mealString +
              ".",
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
      //console.log(jsonObject.itinerary);        //This is the itinerary
      await addChatGPTTripData(
        currentUser.uid,
        tripid,
        itinerary,
        jsonObject.itinerary
      );
      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
      setLoading(false);
    }
  };

  const getDataTrip = async () => {
    try {
      const data = await getTripData(currentUser.uid, tripid);
      setTrip(data);
    } catch (err) {
      alert(err);
    }
  };

  const getTripLodging = async () => {
    try {
      const docRef = doc(db,"userprofile",currentUser.uid,"trips",tripid,"settings","lodgingdata");
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setLodging(docSnap.data());
        }
      });

      return unsubscribe;
    } catch (error) {
      alert("Error setting up lodging data listener:", error);
    }
  };

  const getTripMealsData = async () => {
    const docCollection = query(collection(db, "userprofile", currentUser.uid, "trips", tripid, "meals"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          description: doc.data().description,
          category: doc.data().category,
          name: doc.data().name,
          review_stars: doc.data().review_stars,
          website: doc.data().website,
        };
        list.push(data);
        itemCount += 1;
      });
      setMealString(formatDataIntoString(list));
    });
  };

  const getTripActivityData = async () => {
    const docCollection = query(collection(db,"userprofile",currentUser.uid,"trips",tripid,"activities"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
          description: doc.data().description,
          hours_spent: doc.data().hours_spent,
          name: doc.data().name,
          review_stars: doc.data().review_stars,
          website: doc.data().website,
        };
        list.push(data);
        itemCount += 1;
      });
      setActivityString(formatDataIntoString(list));
    });
  };

  const getItineraryData = async () => {
    const docCollection = query(collection(db,"userprofile",currentUser.uid,"trips",tripid,"itinerary"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          Id: doc.id,
          Subject: doc.data().Subject,
          Location: doc.data().Location,
          Description: doc.data().Description,
          StartTime: doc.data().StartTime.toDate(),
          EndTime: doc.data().EndTime.toDate(),
          IsAllDay: doc.data().IsAllDay,
          RecurrenceRule: doc.data().RecurrenceRule,
          RecurrenceException: doc.data().RecurrenceException,
          Color: "green",
          EventColor: doc.data().EventColor,
        };
        list.push(data);
      });
      setItinerary(list);
    });
  };

  useEffect(() => {
    getDataTrip();
    getTripLodging();
    getTripMealsData();
    getTripActivityData();
    getItineraryData();
    return () => {
      setLodging({});
      setTrip({});
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
        <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "White",
            borderRadius: "10px",
          }}
          onClick={generateAIItinerary}
          className={`text-md p-3 hover:drop-shadow-xl mb-2 mr-5`}
        >
          Generate Itinerary
        </button>
      )}
    </>
  );
};

export default GenerateItinerary;
