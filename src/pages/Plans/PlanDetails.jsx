import React, { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";

//Visual
import { Header } from "../../components";
import { Box, TextField } from "@mui/material";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";

import { updatePlanStartDate, updatePlanEndDate } from "../../globalFunctions/firebaseGlobals";

const PlanDetails = () => {
  const { currentSelectedPlan } = useStateContext();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [plan, setPlan] = useState({});

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setStartDate(docSnap.data().StartDate);
        setEndDate(docSnap.data().EndDate);
      }
    } catch (err) {
      alert(err);
    }
  };

  const onChangeStartDate = (args) => {
    setStartDate(args.target.value);
    //setCalendarViewComponents(args.target.value, endDate);
    updatePlanStartDate(currentSelectedPlan,args.target.value);
  };

  const onChangeEndDate = (args) => {
    setEndDate(args.target.value);
    //setCalendarViewComponents(startDate, args.target.value);
    updatePlanEndDate(currentSelectedPlan,args.target.value);
  };

  useEffect(() => {
    setPlanFromContext();
    console.log(plan);
    return () => {
      setPlan([]);
    };
  }, []);

  const styles = {
    input: {
      color: 'bg-white dark:text-gray-200 dark:bg-secondary-dark-bg', // Change this to your desired font color
    },
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Plan Details" title={plan.Name} />
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
            className: 'bg-white dark:text-gray-200 dark:bg-secondary-dark-bg'
          }}
          margin="dense"
          required
          id="StartDate"
          label="Start Date"
          type="date"
          fullWidth
          variant="filled"
          value={startDate}
          onChange={onChangeStartDate}
          sx={{ gridColumn: "span 2" }}
          InputProps={{
            className: 'bg-white dark:text-gray-200 dark:bg-secondary-dark-bg'
          }}
        />
        <TextField
          InputLabelProps={{ 
            shrink: true,
            className: 'bg-white dark:text-gray-200 dark:bg-secondary-dark-bg'
          }}
          margin="dense"
          required
          id="EndDate"
          label="End Date"
          type="date"
          fullWidth
          variant="filled"
          value={endDate}
          onChange={onChangeEndDate}
          sx={{ gridColumn: "span 2" }}
          InputProps={{
            className: 'bg-white dark:text-gray-200 dark:bg-secondary-dark-bg'
          }}
          
        />
      </Box>
    </div>
  );
};

export default PlanDetails;
