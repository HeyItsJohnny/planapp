import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

//Visual
import { SummaryHeader } from "../../components";
import { Box, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Days from "./Days";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";
import { updatePlanDestination } from "../../globalFunctions/firebaseGlobalFunctions";

import {
  convertDateFormat,
} from "../../globalFunctions/globalFunctions";


const Summary = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const { currentSelectedPlan, setEnableAirfare, setEnableLodging, setEnableToDos } = useStateContext();
  const [plan, setPlan] = useState({});
  const [destination, setDestination] = useState("");
  const [planDates, setPlanDates] = useState("");

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setDestination(docSnap.data().Destination);
        setEnableLodging(docSnap.data().EnableLodging);
        setEnableAirfare(docSnap.data().EnableAirfare);
        setEnableToDos(docSnap.data().EnableToDos);
        setPlanDates(convertDateFormat(docSnap.data().StartDate) + ' - ' + convertDateFormat(docSnap.data().EndDate))
      }
    } catch (err) {
      alert(err);
    }
  };

  const onChangeDestination = (args) => {
    setDestination(args.target.value);
    updatePlanDestination(currentSelectedPlan, args.target.value);
  };

  useEffect(() => {
    setPlanFromContext();
    return () => {
      setPlan([]);
    };
  }, []);

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <SummaryHeader category="Summary" title={plan.Name} dates={planDates} />
        <ToastContainer />
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
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
            margin="dense"
            required
            id="StartDate"
            label="Destination"
            type="text"
            fullWidth
            variant="filled"
            value={destination}
            onChange={onChangeDestination}
            sx={{ gridColumn: "span 4" }}
            InputProps={{
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
          />
        </Box>
      </div>
      <Days />
    </>
  );
};

export default Summary;
