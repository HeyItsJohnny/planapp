import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, TextField } from "@mui/material";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  updatePlanTotalBudget,
} from "../../globalFunctions/firebaseGlobals";

const PlanBudget = () => {
  const [plan, setPlan] = useState({});
  const [totalBudget, setTotalBudget] = useState(0);

  const { currentSelectedPlan } = useStateContext();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setTotalBudget(docSnap.data().TotalPlanBudget);
      }
    } catch (err) {
      alert(err);
    }
  };

  const onChangeTotalBudget = (args) => {
    setTotalBudget(args.target.value);
    updatePlanTotalBudget(currentSelectedPlan, args.target.value);
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
        <Header category="Plan" title="Budget" />
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
            id="TotalBudget"
            label="Total Budget"
            type="text"
            fullWidth
            variant="filled"
            value={totalBudget}
            onChange={onChangeTotalBudget}
            sx={{ gridColumn: "span 1" }}
            InputProps={{
              className: "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
          />
        </Box>
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">

      </div>
    </>
  );
};

export default PlanBudget;
