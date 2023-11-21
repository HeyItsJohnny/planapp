import React, { useState, useEffect } from "react";

//MUI Dialog
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

//Firebase
import { db } from "../../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../../../contexts/AuthContext";

//Functions 
import { useStateContext } from "../../../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import { startCreateAIMealDocuments } from "../../../globalFunctions/firebaseFunctions";

//Chat GPT
import { Configuration, OpenAIApi } from "openai";

const AITripMealModal = () => {
  const { currentColor } = useStateContext();
  const { tripid } = useParams();
  const { currentUser } = useAuth();

  const [tripDestination, setTripDestination] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  
  let [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  //Get Trip Destination -
  const setTripFromURL = async () => {
    try {
      const docRef = doc(db, "userprofile", currentUser.uid, "trips", tripid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTripDestination(docSnap.data().Destination);
      }
    } catch (err) {
      alert(err);
    }
  };
  //Get Trip Destination +

  //Dialog Functions -
  const handleShow = () => {
    getAIGeneratedMeals();
    setShow(true);
  };

  const handleClose = () => {
    startCreateAIMealDocuments(currentUser.uid, tripid, selectedItems);
    setSelectedItems([]);
    setShow(false);
  };

  const handleToggle = (value) => () => {
    const currentIndex = selectedItems.indexOf(value);
    const newSelectedItems = [...selectedItems];

    if (currentIndex === -1) {
      newSelectedItems.push(value);
    } else {
      newSelectedItems.splice(currentIndex, 1);
    }

    setSelectedItems(newSelectedItems);
  };
  //Dialog Functions +

  //Chat GPT -
  const configuration = new Configuration({
    apiKey: "",
  });
  const openai = new OpenAIApi(configuration);

  const getAIGeneratedMeals = async () => {
    try {
      setLoading(true);
      setRestaurants([]);

      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being restaurants, properties: resturant_name, review_stars, website, category. Please provide up to 10 restaurants.",
          },
          {
            role: "user",
            content:
              "Please give me a list of popular resturants in " +
              tripDestination +
              "?",
          },
        ],
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const returnText = response.data.choices[0].message.content.replace(
        /(\r\n|\n|\r)/gm,
        ""
      );
      const jsonObject = JSON.parse(returnText);
      setRestaurants(jsonObject.restaurants);

      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
      //setLoading(false);
    }
  };
  //Chat GPT +

  useEffect(() => {
    setTripFromURL();
    return () => {
      setRestaurants([]);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        style={{
          backgroundColor: currentColor,
          color: "White",
          borderRadius: "10px",
        }}
        onClick={handleShow}
        className={`text-md p-3 hover:drop-shadow-xl mb-2 mr-5`}
      >
        Suggest
      </button>
      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Select Meal Options</DialogTitle>
        <DialogContent>
          <List>
            {loading ? (
              <ListItemText
              primary="Content is Loading.."
              secondary="Please Wait."
            />
            ) : (
              restaurants.map((restaurant) => (
                <ListItem
                  key={restaurant.restaurant_name}
                  button
                  onClick={handleToggle(restaurant)}
                >
                  <Checkbox checked={selectedItems.includes(restaurant)} />
                  <ListItemText
                    primary={`${restaurant.restaurant_name} (${restaurant.category})`}
                    secondary={`Stars: ${restaurant.review_stars}`}
                  />
                </ListItem>
              ))
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShow(false)}>Cancel</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AITripMealModal;
