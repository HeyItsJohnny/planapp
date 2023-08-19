import React, { useState, useEffect } from "react";

//VISUAL
import { Header } from "../../components";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, TextField } from "@mui/material";
import { Pie } from "../../components";
import { BsCurrencyDollar } from "react-icons/bs";

//Data
import { db } from "../../firebase/firebase";
import { doc, getDoc, query, collection, onSnapshot } from "firebase/firestore";
import { useStateContext } from "../../contexts/ContextProvider";
import { updatePlanTotalBudget } from "../../globalFunctions/firebaseGlobals";
import {
  getBudgetByCategory,
  getBudgetPieChartData,
} from "../../globalFunctions/globalFunctions";

//SAMPLE
import { ecomPieChartData, recentTransactions } from "../../data/dummy";
import NewBudgetCostModal from "../../modals/NewBudgetCostModal";

const PlanBudget = () => {
  const [plan, setPlan] = useState({});
  const [totalBudget, setTotalBudget] = useState(0);

  const [budgetBreakdown, setBudgetBreakdown] = useState([]);
  const [budgetPieChart, setBudgetPieChart] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  const { currentSelectedPlan } = useStateContext();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setTotalBudget(docSnap.data().TotalPlanBudget);
        getBudgetData2(docSnap.data().TotalPlanBudget);
      }
    } catch (err) {
      alert(err);
    }
  };

  const onChangeTotalBudget = (args) => {
    setTotalBudget(args.target.value);
    updatePlanTotalBudget(currentSelectedPlan, args.target.value);
    getBudgetData2(args.target.value);
  };

  //Visual data
  const getBudgetData = async () => {
    try {
      const docCollection = query(
        collection(db, "plans", currentSelectedPlan, "budgetcosts")
      );
      onSnapshot(docCollection, (querySnapshot) => {
        const list = [];
        var totalCostVar = 0;

        querySnapshot.forEach((doc) => {
          var data = {
            id: doc.id,
            BudgetCategory: doc.data().BudgetCategory,
            Summary: doc.data().Summary,
            Cost: Number(doc.data().Cost),
          };

          list.push(data);
          totalCostVar = totalCostVar + Number(doc.data().Cost);
        });
        const BudByCategory = getBudgetByCategory(list);
        setBudgetPieChart(getBudgetPieChartData(BudByCategory, totalCostVar, totalBudget));
        setBudgetBreakdown(BudByCategory);
        setTotalCost(totalCostVar);
      });
    } catch (err) {
      alert(err);
    }
  };

  //Additional Function to get once Budget is changed
  const getBudgetData2 = async (TotalBudget2) => {
    try {
      const docCollection = query(
        collection(db, "plans", currentSelectedPlan, "budgetcosts")
      );
      onSnapshot(docCollection, (querySnapshot) => {
        const list = [];
        var totalCostVar = 0;

        querySnapshot.forEach((doc) => {
          var data = {
            id: doc.id,
            BudgetCategory: doc.data().BudgetCategory,
            Summary: doc.data().Summary,
            Cost: Number(doc.data().Cost),
          };

          list.push(data);
          totalCostVar = totalCostVar + Number(doc.data().Cost);
        });
        const BudByCategory = getBudgetByCategory(list);
        setBudgetPieChart(getBudgetPieChartData(BudByCategory, totalCostVar, TotalBudget2));
        setBudgetBreakdown(BudByCategory);
        setTotalCost(totalCostVar);
      });
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (currentSelectedPlan !== "") {
      setPlanFromContext();
      //getBudgetData();
    }
    return () => {
      setPlan([]);
      setBudgetBreakdown([]);
      setBudgetPieChart([]);
    };
  }, []);

  //TO DO:
  //Create Modal for Budget

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
              className:
                "bg-white dark:text-gray-200 dark:bg-secondary-dark-bg",
            }}
          />
        </Box>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-between items-center gap-2">
            <p className="text-xl font-semibold">Breakdown per Category</p>
          </div>
          <div className="mt-10 w-72 md:w-400">
            {budgetBreakdown.map((item) => (
              <div key={item.id} className="flex justify-between mt-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    style={{
                      color: "#03C9D7",
                      backgroundColor: "#E5FAFB",
                    }}
                    className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                  >
                    <BsCurrencyDollar />
                  </button>
                  <div>
                    <p className="text-md font-semibold">{item.BudgetCategory}</p>
                  </div>
                </div>
                <p>${item.Cost}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-5 border-t-1 border-color">
            <div className="mt-3">
              <NewBudgetCostModal />
            </div>

            <p className="text-gray-400 text-md">Total: ${totalCost}</p>
          </div>
        </div>
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl w-96 md:w-760">
          <div className="flex justify-between items-center gap-2 mb-10">
            <p className="text-xl font-semibold">Budget Breakdown</p>
          </div>
          <div className="md:w-full overflow-auto">
            <Pie
              id="pie-chart"
              data={budgetPieChart}
              legendVisiblity={true}
              height="350px"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanBudget;
