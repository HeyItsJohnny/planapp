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

import { useAuth } from "../../../contexts/AuthContext";

//Functions 
import { useStateContext } from "../../../contexts/ContextProvider";
import { useParams } from "react-router-dom";
import { startCreateAIMealDocuments } from "../../../globalFunctions/firebaseFunctions";
import { getChatRestaurants } from "../../../globalFunctions/chatGPTFunctions";
import { getTripData } from "../../../globalFunctions/firebaseGETFunctions";

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
      const data = await getTripData(currentUser.uid,tripid);
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

  const suggestMore = () => {
    getAIGeneratedMeals();
  }

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

  const getAIGeneratedMeals = async () => {
    try {
      setLoading(true);
      setRestaurants([]);
      const chatGPTRestaurants = await getChatRestaurants(tripDestination);
      setRestaurants(chatGPTRestaurants.restaurants);
      setLoading(false);
    } catch (error) {
      alert("ERROR: " + error);
    }
  };

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
          <Button onClick={suggestMore}>Suggest More</Button>
          <Button onClick={handleClose}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AITripMealModal;
