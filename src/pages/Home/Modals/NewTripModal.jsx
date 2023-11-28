import React, { useState } from "react";
import { useStateContext } from "../../../contexts/ContextProvider";
import { useAuth } from "../../../contexts/AuthContext";

//Modal
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";

//Functions
import { createNewTrip } from "../../../globalFunctions/firebaseFunctions";
import { useNavigate } from "react-router-dom";

const NewTripModal = () => {
  const { currentColor } = useStateContext();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    handleClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tripId = await createNewTrip(currentUser.uid, e);
      navigate("/trip/" + tripId);
      handleReset();
    } catch (error) {
      alert("Error creating new trip: ", error);
    }
  };

  return (
    <>
      <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "White",
            borderRadius: "10px",
          }}
          className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
          onClick={handleShow}
        >
          New Trip
        </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Trip</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="TripName"
              label="Trip Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="Destination"
              label="Destination"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="StartDate"
              label="Start Date"
              type="date"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="EndDate"
              label="End Date"
              type="date"
              fullWidth
              variant="standard"
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
              Create New Trip
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default NewTripModal;
