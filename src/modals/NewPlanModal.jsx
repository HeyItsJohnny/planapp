import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { db } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

const NewPlanModal = () => {
  const [show, setShow] = useState(false);
  const [planType, setPlanType] = useState("");
  const [planSubType, setPlanSubType] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

  const handlePlanTypeChange = (event) => {
    setPlanType(event.target.value);
  };

  const handlePlanSubTypeChange = (event) => {
    setPlanSubType(event.target.value);
  };

  const handleReset = () => {
    setPlanType("");
    setPlanSubType("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //addNewPlanDoc(e);
    handleReset();
  };

  async function addNewPlanDoc(data) {
    try {
      await addDoc(collection(db, "plans"), {
        Name: data.target.Name.value,
        Type: planType,
        SubType: planSubType
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
        Add
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Plan</DialogTitle>
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
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={planType}
                label="Status"
                onChange={handlePlanTypeChange}
                required
              >
                <MenuItem value="Half Day">Half Day</MenuItem>
                <MenuItem value="Full Day">Full Day</MenuItem>
                <MenuItem value="Multiple Days">Multiple Days</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">SubType</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={planSubType}
                label="Status"
                onChange={handlePlanSubTypeChange}
                required
              >
                <MenuItem value="Family">Family</MenuItem>
                <MenuItem value="Friends">Friends</MenuItem>
              </Select>
            </FormControl>
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
