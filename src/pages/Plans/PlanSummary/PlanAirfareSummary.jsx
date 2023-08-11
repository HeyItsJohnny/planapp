import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../../components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, TextField } from "@mui/material";

const PlanAirfareSummary = () => {
  const [departureDate1, setDepartureDate1] = useState("");
  const [arrivalDate1, setArrivalDate1] = useState("");
  const [departureTime1, setDepartureTime1] = useState("");
  const [arrivalTime1, setArrivalTime1] = useState("");

  const [departureDate2, setDepartureDate2] = useState("");
  const [arrivalDate2, setArrivalDate2] = useState("");
  const [departureTime2, setDepartureTime2] = useState("");
  const [arrivalTime2, setArrivalTime2] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const onChangeDepartureDate1 = (args) => {
    setDepartureDate1(args.target.value);
  };

  const onChangeArrivalDate1 = (args) => {
    setArrivalDate1(args.target.value);
  };

  const onChangeDepartureTime1 = (args) => {
    setDepartureTime1(args.target.value);
  };

  const onChangeArrivalTime1 = (args) => {
    setArrivalTime1(args.target.value);
  };

  const onChangeDepartureDate2 = (args) => {
    setDepartureDate2(args.target.value);
  };

  const onChangeArrivalDate2 = (args) => {
    setArrivalDate2(args.target.value);
  };

  const onChangeDepartureTime2 = (args) => {
    setDepartureTime2(args.target.value);
  };

  const onChangeArrivalTime2 = (args) => {
    setArrivalTime2(args.target.value);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Plan Summary" title="Airfare" />
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="DepartureDate1"
          label="Departure Date 1"
          type="date"
          fullWidth
          variant="filled"
          value={departureDate1}
          onChange={onChangeDepartureDate1}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="ArrivalDate1"
          label="Arrival Date 1"
          type="date"
          fullWidth
          variant="filled"
          value={arrivalDate1}
          onChange={onChangeArrivalDate1}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="DepartureDate2"
          label="Departure Date 2"
          type="date"
          fullWidth
          variant="filled"
          value={departureDate2}
          onChange={onChangeDepartureDate2}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="ArrivalDate2"
          label="Arrival Date 2"
          type="date"
          fullWidth
          variant="filled"
          value={arrivalDate2}
          onChange={onChangeArrivalDate2}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="DepartureTime1"
          label="Departure Time 1"
          type="time"
          fullWidth
          variant="filled"
          value={departureTime1}
          onChange={onChangeDepartureTime1}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="ArrivalTime1"
          label="Arrival Time 1"
          type="time"
          fullWidth
          variant="filled"
          value={arrivalTime1}
          onChange={onChangeArrivalTime1}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="DepartureTime2"
          label="Departure Time 2"
          type="time"
          fullWidth
          variant="filled"
          value={departureTime2}
          onChange={onChangeDepartureTime2}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
        <TextField
          InputLabelProps={{
            shrink: true,
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
          margin="dense"
          required
          id="ArrivalTime2"
          label="Arrival Time 2"
          type="time"
          fullWidth
          variant="filled"
          value={arrivalTime2}
          onChange={onChangeArrivalTime2}
          sx={{ gridColumn: "span 1" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
      </Box>
    </div>
    
  );
};

export default PlanAirfareSummary;
