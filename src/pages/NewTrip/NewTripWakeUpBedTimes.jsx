import React, { useState } from "react";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

//MUI
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
const NewTripWakeUpBedTimes = ({ timesNext, backStep }) => {
  const { currentColor } = useStateContext();
  const handleSubmit = (e) => {
    e.preventDefault();
    timesNext(e);
  };

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="Details" />
        <form onSubmit={handleSubmit}>
          <TextField
            required
            margin="none"
            id="WakeUpTime"
            label="Wake Up Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              style: { color: "white" }, // Set label color to white
            }}
            InputProps={{
              style: { color: "white" }, // Set label color to white
            }}
            style={{ marginBottom: "20px" }} // Add margin bottom to create space
          />
          <TextField
            required
            margin="dense"
            id="BedTime"
            label="Bed Time"
            type="time"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              style: { color: "white" }, // Set label color to white
            }}
            InputProps={{
              style: { color: "white" }, // Set label color to white
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

export default NewTripWakeUpBedTimes;
