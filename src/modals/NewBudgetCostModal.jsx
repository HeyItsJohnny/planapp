import React, { useState, useEffect } from "react";
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

import { addBudgetCosts } from "../globalFunctions/firebaseGlobals";

const NewBudgetCostModal = () => {
  const [show, setShow] = useState(false);
  const [category, setCategory] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor, currentSelectedPlan } = useStateContext();

  const handleStatusChange = (event) => {
    setCategory(event.target.value);
  };

  const handleReset = () => {
    setCategory("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBudgetCosts(currentSelectedPlan, e, category);
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
        className={`text-md p-3 hover:drop-shadow-xl`}
        onClick={handleShow}
      >
        Add New Cost
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Cost</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Summary"
              label="Budget Summary"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Cost"
              label="Cost"
              type="number"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleStatusChange}
                required
              >
                <MenuItem value="Lodging">Lodging</MenuItem>
                <MenuItem value="Transportation">Transportation</MenuItem>
                <MenuItem value="Food">Food</MenuItem>
                <MenuItem value="Activities">Activities</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
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
  )
};

export default NewBudgetCostModal;
