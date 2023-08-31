import React, { useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { IoIosAddCircle } from "react-icons/io";
import { updateFoodCalendarWithRestaurant } from '../globalFunctions/firebaseGlobalFunctions';

const AddFoodToCalendarModal = ({ item, dayid }) => {
  const [show, setShow] = useState(false);
  const [meal, setMeal] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { currentColor, currentSelectedPlan } = useStateContext();

  const handleMealChange = (event) => {
    setMeal(event.target.value);
  };

  const handleReset = () => {
    setMeal("");
    handleClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //addPeopleInvitedDoc(e);
    //Get Document name E.G. Breakfast_2024_01_16
    //Update Document Subject (Breakfast + Name) & Location (Address)
    alert("NAME: " + item.name + " Day ID: " + dayid);
    handleReset();
  };

  return (
    <>
      <button
        type="button"
        style={{
          color: "#03C9D7",
          backgroundColor: "#E5FAFB",
        }}
        className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
        onClick={handleShow}
      >
        <IoIosAddCircle />
      </button>
      <Dialog open={show} onClose={handleReset}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Restaurant to Calendar</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Pick a Meal</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={meal}
                label="Meal"
                onChange={handleMealChange}
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

export default AddFoodToCalendarModal;
