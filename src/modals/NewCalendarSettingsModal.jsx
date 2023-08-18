import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";

import { addCalendarSettings } from "../globalFunctions/firebaseGlobals";

const NewCalendarSettingsModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor, currentSelectedPlan } = useStateContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    addCalendarSettings(currentSelectedPlan, e);
    handleClose();
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
        className={`text-md p-3 hover:drop-shadow-xl`}
        onClick={handleShow}
      >
        Add Calendar Event
      </button>
      <Dialog open={show} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Calendar Event</DialogTitle>
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
              autoFocus
              required
              margin="dense"
              id="StartTime"
              label="Start Time"
              type="time"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
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

export default NewCalendarSettingsModal;
