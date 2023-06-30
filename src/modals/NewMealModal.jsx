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
import { setDoc, doc } from "firebase/firestore";

const NewMealModal = () => {
  const [show, setShow] = useState(false);
  const [foodType, setFoodType] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor } = useStateContext();

  const handleFoodTypeChange = (event) => {
    setFoodType(event.target.value);
  };

  const handleReset = () => {
    setFoodType("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addRecipeDoc(e);
    handleReset();
  };

  async function addRecipeDoc(data) {
    try {
      await setDoc(doc(db, "familymeals", data.target.Meal.value), {
        Description: data.target.Description.value,
        FoodType: foodType,
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
        Add New Meal
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>New Family Meal</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="Meal"
              label="Meal"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="Description"
              label="Description"
              type="text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Food Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={foodType}
                label="Food Type"
                onChange={handleFoodTypeChange}
                required
              >
                <MenuItem value="Breakfast">Breakfast</MenuItem>
                <MenuItem value="Lunch">Lunch</MenuItem>
                <MenuItem value="Dinner">Dinner</MenuItem>
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

export default NewMealModal;
