import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import {
  getTripActivityData,
  getTripMealsData,
  getSettingsData,
  getTripItineraryData
} from "../../../globalFunctions/firebaseGETFunctions";
import { deleteTrip } from "../../../globalFunctions/firebaseFunctions";
import { useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";

//Modal
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const DeleteTripModal = ({ tripid }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  //Trip Objects
  const [settings, setSettings] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [activities, setActivities] = useState([]);
  const [meals, setMeals] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    deleteTrip(currentUser.uid, tripid, settings, itinerary, activities, meals);
    navigate("/");
    handleReset();
  };

  const getTripSettingsData = async () => {
    try {
      const data = await getSettingsData(currentUser.uid);
      setSettings(data);
    } catch (e) {
      alert("Error: " + e);
    }
  };

  const getTripDataMeals = async () => {
    try {
      const data = await getTripMealsData(currentUser.uid, tripid);
      setMeals(data);
    } catch (e) {
      alert("Error: " + e);
    }
  };

  const getTripDataActivities = async () => {
    try {
      const data = await getTripActivityData(currentUser.uid, tripid);
      setActivities(data);
    } catch (e) {
      alert("Error: " + e);
    }
  };

  const getTripDataItinerary = async () => {
    try {
      const data = await getTripItineraryData(currentUser.uid, tripid);
      setItinerary(data);
    } catch (e) {
      alert("Error: " + e);
    }
  };

  useEffect(() => {
    getTripSettingsData();
    getTripDataMeals();
    getTripDataActivities();
    getTripDataItinerary();
    return () => {
      setSettings([]);
      setItinerary([]);
      setActivities([]);
      setMeals([]);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        style={{
          backgroundColor: "#FF0000",
          color: "White",
          borderRadius: "10px",
        }}
        className={`text-md p-3 hover:drop-shadow-xl float-right`}
        onClick={handleShow}
      >
        <AiTwotoneDelete />
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Do you want to delete this Trip?</DialogTitle>
          <DialogActions>
            <button
              type="submit"
              style={{
                backgroundColor: "#FF0000",
                color: "White",
                borderRadius: "10px",
              }}
              className={`text-md p-3 hover:drop-shadow-xl`}
            >
              Delete
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DeleteTripModal;
