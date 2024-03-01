import React, { useState } from "react";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";

//MUI
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const NewTripSelection = ({ tripTypeNext }) => {
  const { currentColor } = useStateContext();
  const [tripType, setTripType] = useState("");

  const handleTripTypeChange = (event) => {
    setTripType(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    tripTypeNext(tripType);
  };


  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Type" title="Day Trip or Vacation?" />
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg"
            >
              Trip Type
            </InputLabel>
            <Select
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={tripType}
              label="Type"
              onChange={handleTripTypeChange}
              required
            >
              <MenuItem value="Vacation">Vacation</MenuItem>
              <MenuItem value="DayTrip">Day Trip</MenuItem>
            </Select>
          </FormControl>
          <div className="mt-10">
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

export default NewTripSelection;
