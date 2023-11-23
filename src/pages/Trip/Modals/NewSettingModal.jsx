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
import { addNewSettings } from "../../../globalFunctions/firebaseFunctions";
import { useParams } from "react-router-dom";

const NewSettingModal = () => {
  const { currentColor } = useStateContext();
  const { currentUser } = useAuth();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleReset = () => {
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addNewSettings(currentUser.uid, e);
    handleReset();
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
        New Setting
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Setting</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="CalendarEvent"
              label="Calendar Event"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="StartTime"
              label="Start Time"
              type="time"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="dense"
              id="EndTime"
              label="End Time"
              type="time"
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
              Add
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default NewSettingModal;
