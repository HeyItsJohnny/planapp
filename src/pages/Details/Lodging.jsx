import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//DATA
import { useStateContext } from "../../contexts/ContextProvider";
import {
  updatePlanLodgingCheckinDate,
  updatePlanLodgingCheckinTime,
  updatePlanLodgingCheckoutDate,
  updatePlanLodgingCheckoutTime,
  updatePlanLodgingAddress1,
  updatePlanLodgingAddress2,
  updatePlanLodgingAddressCity,
  updatePlanLodgingAddressState,
  updatePlanLodgingAddressZip,
  addCheckinCalendar,
  addCheckoutCalendar,
  deletePlanCalendar,
} from "../../globalFunctions/firebaseGlobalFunctions";

import { convertDateTimeString, formatDateToYYYYMMDD, localFormattedDate } from "../../globalFunctions/globalFunctions";

import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const Lodging = () => {
  const { currentSelectedPlan, currentColor } = useStateContext();

  const [checkinDate, setCheckinDate] = useState("");
  const [checkinTime, setCheckinTime] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [checkoutTime, setCheckoutTime] = useState("");
  const [lodgingAddress1, setLodgingAddress1] = useState("");
  const [lodgingAddress2, setLodgingAddress2] = useState("");
  const [lodgingAddressCity, setLodgingAddressCity] = useState("");
  const [lodgingAddressState, setLodgingAddressState] = useState("");
  const [lodgingAddressZip, setLodgingAddressZip] = useState("");

  const isNonMobile = useMediaQuery("(min-width:600px)");

  const onChangeCheckinDate = (args) => {
    setCheckinDate(args.target.value);
    updatePlanLodgingCheckinDate(currentSelectedPlan, args.target.value);
  };

  const onChangeCheckinTime = (args) => {
    setCheckinTime(args.target.value);
    updatePlanLodgingCheckinTime(currentSelectedPlan, args.target.value);
  };

  const onChangeCheckoutDate = (args) => {
    setCheckoutDate(args.target.value);
    updatePlanLodgingCheckoutDate(currentSelectedPlan, args.target.value);
  };

  const onChangeCheckoutTime = (args) => {
    setCheckoutTime(args.target.value);
    updatePlanLodgingCheckoutTime(currentSelectedPlan, args.target.value);
  };

  const onChangeLodgingAddress1 = (args) => {
    setLodgingAddress1(args.target.value);
    updatePlanLodgingAddress1(currentSelectedPlan, args.target.value);
  };

  const onChangeLodgingAddress2 = (args) => {
    setLodgingAddress2(args.target.value);
    updatePlanLodgingAddress2(currentSelectedPlan, args.target.value);
  };

  const onChangeLodgingAddressCity = (args) => {
    setLodgingAddressCity(args.target.value);
    updatePlanLodgingAddressCity(currentSelectedPlan, args.target.value);
  };

  const onChangeLodgingAddressState = (args) => {
    setLodgingAddressState(args.target.value);
    updatePlanLodgingAddressState(currentSelectedPlan, args.target.value);
  };

  const onChangeLodgingAddressZip = (args) => {
    setLodgingAddressZip(args.target.value);
    updatePlanLodgingAddressZip(currentSelectedPlan, args.target.value);
  };

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCheckinDate(docSnap.data().LodgingCheckinDate);
        setCheckinTime(docSnap.data().LodgingCheckinTime);
        setCheckoutDate(docSnap.data().LodgingCheckoutDate);
        setCheckoutTime(docSnap.data().LodgingCheckoutTime);
        setLodgingAddress1(docSnap.data().LodgingAddress1);
        setLodgingAddress2(docSnap.data().LodgingAddress2);
        setLodgingAddressCity(docSnap.data().LodgingAddressCity);
        setLodgingAddressState(docSnap.data().LodgingAddressState);
        setLodgingAddressZip(docSnap.data().LodgingAddressZip);
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleAddToItinerary = () => {

    //Get Date ID -
    const CheckinDateDocFormattedDate = new Date(checkinDate);
    CheckinDateDocFormattedDate.setDate(CheckinDateDocFormattedDate.getDate() + 1);

    const CheckinDateDoc = formatDateToYYYYMMDD(CheckinDateDocFormattedDate);

    const CheckoutDateDocFormattedDate = new Date(checkoutDate);
    CheckoutDateDocFormattedDate.setDate(CheckoutDateDocFormattedDate.getDate() + 1);

    const CheckoutDateDoc = formatDateToYYYYMMDD(CheckoutDateDocFormattedDate);
    //Get Date ID +

    //Delete Current Check In
    deletePlanCalendar(currentSelectedPlan, CheckinDateDoc, "LodgingCheckin");

    //Checkin Date/Time
    const LocalDateCheckinStartTime = convertDateTimeString(
      checkinDate,
      checkinTime
    );
    const LocalDateCheckinEndTime = new Date(LocalDateCheckinStartTime);
    LocalDateCheckinEndTime.setMinutes(LocalDateCheckinStartTime.getMinutes() + 20);

    addCheckinCalendar(
      currentSelectedPlan,
      CheckinDateDoc,
      LocalDateCheckinStartTime,
      LocalDateCheckinEndTime
    );

    //Delete Current Check Out
    deletePlanCalendar(currentSelectedPlan, CheckoutDateDoc, "LodgingCheckout");

    //Checkout Date/Time
    const LocalDateCheckoutStartTime = convertDateTimeString(
      checkoutDate,
      checkoutTime
    );
    const LocalDateCheckoutEndTime = new Date(LocalDateCheckoutStartTime);
    LocalDateCheckoutEndTime.setMinutes(LocalDateCheckoutStartTime.getMinutes() + 30);

    addCheckoutCalendar(
      currentSelectedPlan,
      CheckoutDateDoc,
      LocalDateCheckoutStartTime,
      LocalDateCheckoutEndTime
    );

    toast("Lodging dates updated in the itinerary!");
  };

  useEffect(() => {
    setPlanFromContext();
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Itinerary" title="Lodging" />
      <ToastContainer />
      <div className="mb-10">
        <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "White",
            borderRadius: "10px",
          }}
          className={`text-md p-3 hover:drop-shadow-xl`}
          onClick={handleAddToItinerary}
        >
          Add Lodging to Itinerary
        </button>
      </div>

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
          id="CheckinDate"
          label="Checkin Date"
          type="date"
          fullWidth
          variant="filled"
          value={checkinDate}
          onChange={onChangeCheckinDate}
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
          id="CheckinTime"
          label="Checkin Time"
          type="time"
          fullWidth
          variant="filled"
          value={checkinTime}
          onChange={onChangeCheckinTime}
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
          id="CheckoutDate"
          label="Checkout Date"
          type="date"
          fullWidth
          variant="filled"
          value={checkoutDate}
          onChange={onChangeCheckoutDate}
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
          id="CheckoutTime"
          label="Checkout Time"
          type="time"
          fullWidth
          variant="filled"
          value={checkoutTime}
          onChange={onChangeCheckoutTime}
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
          id="HousingAddress1"
          label="Address 1"
          type="text"
          fullWidth
          variant="filled"
          value={lodgingAddress1}
          onChange={onChangeLodgingAddress1}
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
          id="HousingAddress2"
          label="Address 2"
          type="text"
          fullWidth
          variant="filled"
          value={lodgingAddress2}
          onChange={onChangeLodgingAddress2}
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
          value={lodgingAddressCity}
          onChange={onChangeLodgingAddressCity}
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
          value={lodgingAddressState}
          onChange={onChangeLodgingAddressState}
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
          value={lodgingAddressZip}
          onChange={onChangeLodgingAddressZip}
          sx={{ gridColumn: "span 2" }}
          InputProps={{
            className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
          }}
        />
      </Box>
    </div>
  );
};

export default Lodging;
