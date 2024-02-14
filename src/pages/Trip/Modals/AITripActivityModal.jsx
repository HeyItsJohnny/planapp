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
import { startCreateAIActivityDocuments } from "../../../globalFunctions/firebaseFunctions";

//Chat GPT
import { Configuration, OpenAIApi } from "openai";

const AITripActivityModal = () => {
  const { currentColor } = useStateContext();
  const { tripid } = useParams();
  const { currentUser } = useAuth();

  const [tripDestination, setTripDestination] = useState("");
  const [activities, setActivities] = useState([]);
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
    startCreateAIActivityDocuments(currentUser.uid, tripid, selectedItems);
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
      setActivities([]);
      /*
      console.log("Start");
      const response = await fetch("https://planappapi.onrender.com/getTripActivity", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          Destination: tripDestination
        })
      }) 
      .catch(err => {
        alert('Network Error: ' + err);
      })
      console.log("END");
      console.log("RESPONSE: " + response);
      console.log("RESPONSE STATUS: " + response.status);
      //createNewOrder(response.status);
      */
      
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You will be provided with a question, and your task is to parse the answers it into JSON format with the key being activities, properties: activity_name, description, review_stars, website, hours_spent. Please limit to 10 activities.",
          },
          {
            role: "user",
            content:
              "Please give me a list of things to do, sites and attractions in " +
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
      
      setActivities(jsonObject.activities);

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
      setActivities([]);
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
        <DialogTitle>Select Activities</DialogTitle>
        <DialogContent>
          <List>
            {loading ? (
              <ListItemText
                primary="Content is Loading.."
                secondary="Please Wait."
              />
            ) : (
              activities.map((activity) => (
                <ListItem
                  key={activity.activity_name}
                  button
                  onClick={handleToggle(activity)}
                >
                  <Checkbox checked={selectedItems.includes(activity)} />
                  <ListItemText
                    primary={`${activity.activity_name} (${activity.hours_spent} Hours)`}
                    secondary={`Stars: ${activity.review_stars}`}
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

export default AITripActivityModal;
