import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

const NewPlanModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

  const handleReset = () => {
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addPlanDoc(e);
    handleReset();
  };

  async function addPlanDoc(data) {
    try {
      const docRef = await addDoc(collection(db, "familyplans"), {
        PlanName: data.target.PlanName.value,
        StartDate: data.target.StartDate.value,
        EndDate: data.target.EndDate.value,
      });
    } catch (error) {
      alert("There was an error adding to the database: " + error);
    }
  }

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
        Add New Plan
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Plan</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="PlanName"
              label="Plan Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              required
              margin="none"
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
              Add
            </button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default NewPlanModal;
