import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { db } from "../../../firebase/firebase";
import { onSnapshot, query, collection } from "firebase/firestore";
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
    const docCollection = query(collection(db,"userprofile",currentUser.uid,"trips",tripid,"settings"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
        };
        list.push(data);
        itemCount += 1;
      });
      setSettings(list);
    });
  };

  const getTripMealsData = async () => {
    const docCollection = query(collection(db, "userprofile", currentUser.uid, "trips", tripid, "meals"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      var itemCount = 1;
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
        };
        list.push(data);
        itemCount += 1;
      });
      setMeals(list);
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
        };
        list.push(data);
        itemCount += 1;
      });
      setActivities(list);
    });
  };

  const getItineraryData = async () => {
    const docCollection = query(collection(db,"userprofile",currentUser.uid,"trips",tripid,"itinerary"));
    onSnapshot(docCollection, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        var data = {
          id: doc.id,
        };
        list.push(data);
      });
      setItinerary(list);
    });
  };

  useEffect(() => {
    getTripSettingsData();
    getTripMealsData();
    getTripActivityData();
    getItineraryData();
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
