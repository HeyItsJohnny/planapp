import React, { useState, useEffect } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";

//Dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

//Toast
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Functions
import { useParams } from "react-router-dom";
import { updateLodgingDoc, createLodgingDataForTrip } from "../../../globalFunctions/firebaseFunctions";
import { getTripLodgingData } from "../../../globalFunctions/firebaseGETFunctions";
import { useAuth } from "../../../contexts/AuthContext";


const UpdateLodgingModal = () => {
  const { currentColor } = useStateContext();
  const { currentUser } = useAuth();
  const { tripid } = useParams();
  const [show, setShow] = useState(false);
  const [lodgingExists, setLodgingExists] = useState(false);
  const [lodgingName, setLodgingName] = useState("");
  const [lodgingAddress1, setLodgingAddress1] = useState("");
  const [lodgingAddress2, setLodgingAddress2] = useState("");
  const [lodgingCity, setLodgingCity] = useState("");
  const [lodgingState, setLodgingState] = useState("");
  const [lodgingZipCode, setLodgingZipCode] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    handleClose();
  };

  const handleNameChange = (event) => {
    setLodgingName(event.target.value);
  };

  const handleAddress1Change = (event) => {
    setLodgingAddress1(event.target.value);
  };

  const handleAddress2Change = (event) => {
    setLodgingAddress2(event.target.value);
  };

  const handleCityChange = (event) => {
    setLodgingCity(event.target.value);
  };

  const handleStateChange = (event) => {
    setLodgingState(event.target.value);
  };

  const handleZipCodeChange = (event) => {
    setLodgingZipCode(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    var lodgingData = {
      Name: lodgingName,
      Address1: lodgingAddress1,
      Address2: lodgingAddress2,
      City: lodgingCity,
      State: lodgingState,
      ZipCode: lodgingZipCode,
    };

    if (lodgingExists === true) {
      updateLodgingDoc(currentUser.uid, tripid, lodgingData);
    } else {
      createLodgingDataForTrip(currentUser.uid, tripid, lodgingData);
    }
    toast("Lodging has been updated.");
    handleReset();
  };

  const setTripLodgingFromURL = async () => {
    try {
      const data = await getTripLodgingData(currentUser.uid,tripid);
      if (data !== null) {
        setLodgingExists(true);
        setLodgingName(data.Name);
        setLodgingAddress1(data.Address1);
        setLodgingAddress2(data.Address2);
        setLodgingCity(data.City);
        setLodgingState(data.State);
        setLodgingZipCode(data.ZipCode);
      }
    } catch (err) {
      console.log("No Lodging: " + err);
    }
  };

  useEffect(() => {
    setTripLodgingFromURL();
    return () => {};
  }, []);

  return (
    <>
      <ToastContainer />
      <button
        type="button"
        style={{
          backgroundColor: currentColor,
          color: "White",
          borderRadius: "10px",
        }}
        onClick={handleShow}
        className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
      >
        Update Lodging
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Change Lodging</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={lodgingName}
              onChange={handleNameChange}
            />
            <TextField
              required
              margin="dense"
              id="Address1"
              label="Address 1"
              type="text"
              fullWidth
              variant="standard"
              value={lodgingAddress1}
              onChange={handleAddress1Change}
            />
            <TextField
              margin="dense"
              id="Address2"
              label="Address 2"
              type="text"
              fullWidth
              variant="standard"
              value={lodgingAddress2}
              onChange={handleAddress2Change}
            />
            <TextField
              required
              margin="dense"
              id="City"
              label="City"
              type="text"
              fullWidth
              variant="standard"
              value={lodgingCity}
              onChange={handleCityChange}
            />
            <TextField
              required
              margin="dense"
              id="State"
              label="State"
              type="text"
              fullWidth
              variant="standard"
              value={lodgingState}
              onChange={handleStateChange}
            />
            <TextField
              required
              margin="dense"
              id="ZipCode"
              label="Zip Code"
              type="text"
              fullWidth
              variant="standard"
              value={lodgingZipCode}
              onChange={handleZipCodeChange}
            />
          </DialogContent>
          <DialogActions>
            <button
              type="submit"
              style={{
                backgroundColor: currentColor,
                color: "White",
                borderRadius: "10px",
              }}
              className={`text-md p-3 hover:drop-shadow-xl`}
            >
              Update
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default UpdateLodgingModal;
