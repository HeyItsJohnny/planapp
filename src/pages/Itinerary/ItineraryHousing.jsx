import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, TextField } from "@mui/material";

const ItineraryHousing = () => {
  const [housingAddress1, setHousingAddress1] = useState("");
  const [housingAddress2, setHousingAddress2] = useState("");
  const [housingAddressCity, setHousingAddressCity] = useState("");
  const [housingAddressState, setHousingAddressState] = useState("");
  const [housingAddressZip, setHousingAddressZip] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const onChangeHousingAddress1 = (args) => {
    setHousingAddress1(args.target.value);
  };

  const onChangeHousingAddress2 = (args) => {
    setHousingAddress2(args.target.value);
  };

  const onChangeHousingAddressCity = (args) => {
    setHousingAddressCity(args.target.value);
  };

  const onChangeHousingAddressState = (args) => {
    setHousingAddressState(args.target.value);
  };

  const onChangeHousingAddressZip = (args) => {
    setHousingAddressZip(args.target.value);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Itinerary" title="Housing" />
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
          id="HousingAddress1"
          label="Address 1"
          type="text"
          fullWidth
          variant="filled"
          value={housingAddress1}
          onChange={onChangeHousingAddress1}
          sx={{ gridColumn: "span 2" }}
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
          id="HousingAddress2"
          label="Address 2"
          type="text"
          fullWidth
          variant="filled"
          value={housingAddress2}
          onChange={onChangeHousingAddress2}
          sx={{ gridColumn: "span 2" }}
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
          id="HousingAddressCity"
          label="City"
          type="text"
          fullWidth
          variant="filled"
          value={housingAddressCity}
          onChange={onChangeHousingAddressCity}
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
          id="HousingAddressState"
          label="State"
          type="text"
          fullWidth
          variant="filled"
          value={housingAddressState}
          onChange={onChangeHousingAddressState}
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
          id="HousingAddressZip"
          label="Zip"
          type="text"
          fullWidth
          variant="filled"
          value={housingAddressZip}
          onChange={onChangeHousingAddressZip}
          sx={{ gridColumn: "span 2" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
      </Box>
    </div>
  );
};

export default ItineraryHousing;
