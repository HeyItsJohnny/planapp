import React, { useState } from "react";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

//MUI
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const NewTripDetails = ({ detailsNext, backStep }) => {
  const { currentColor } = useStateContext();
  const [tripCategory, setTripCategory] = useState("");

  const handleTripCategoryChange = (event) => {
    setTripCategory(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    detailsNext(e, tripCategory);
  };

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="Details" />
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg"
            >
              What type of vacation are you looking for?
            </InputLabel>
            <Select
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tripCategory}
              label="Type"
              onChange={handleTripCategoryChange}
              required
              style={{ marginBottom: "20px" }} // Add margin bottom to create space
            >
              <MenuItem value="Relaxation">Relaxation</MenuItem>
              <MenuItem value="Sightseeing">Sightseeing</MenuItem>
              <MenuItem value="RomaticGetaway">Romantic Getaway</MenuItem>
              <MenuItem value="Adventure">Adventure</MenuItem>
              <MenuItem value="FamilyFriendly">Family Friendly</MenuItem>
            </Select>
          </FormControl>
          <TextField
            required
            margin="dense"
            id="Destination"
            label="Destination"
            type="text"
            fullWidth
            variant="standard"
            InputLabelProps={{
              style: { color: "white" } // Set label color to white
            }}
            InputProps={{
              style: { color: "white" } // Set label color to white
            }}
            style={{ marginBottom: "20px" }} // Add margin bottom to create space
          />
          <TextField
            required
            margin="none"
            id="StartDate"
            label=""
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{
              style: { color: "white" } // Set label color to white
            }}
            InputProps={{
              style: { color: "white" } // Set label color to white
            }}
            style={{ marginBottom: "20px" }} // Add margin bottom to create space
          />
          <TextField
            required
            margin="dense"
            id="EndDate"
            label=""
            type="date"
            fullWidth
            variant="standard"
            InputLabelProps={{
              style: { color: "white" } // Set label color to white
            }}
            InputProps={{
              style: { color: "white" } // Set label color to white
            }}
            style={{ marginBottom: "20px" }} // Add margin bottom to create space
          />
          <div className="mt-5 w-72 md:w-400">
            <button
              type="button"
              style={{
                backgroundColor: currentColor,
                color: "White",
                borderRadius: "10px",
              }}
              className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
              onClick={backStep}
            >
              Back
            </button>
            <button
              type="submit"
              style={{
                backgroundColor: currentColor,
                color: "White",
                borderRadius: "10px",
              }}
              className={`text-md p-3 hover:drop-shadow-xl`}
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NewTripDetails;
