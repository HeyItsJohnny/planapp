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
import { useAuth } from "../../../contexts/AuthContext";

//Functions
import { useStateContext } from "../../../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import { startCreateAIActivityDocuments } from "../../../globalFunctions/firebaseFunctions";
import { getChatActivities } from "../../../globalFunctions/chatGPTFunctions";
import { getTripData } from "../../../globalFunctions/firebaseGETFunctions";

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
      const data = await getTripData(currentUser.uid, tripid);
      setTripDestination(data.Destination);
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

  const getAIGeneratedMeals = async () => {
    try {
      setLoading(true);
      setActivities([]);
      const chatGPTActivities = await getChatActivities(tripDestination);
      setActivities(chatGPTActivities.activities);
      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
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
