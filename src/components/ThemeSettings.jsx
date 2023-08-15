import React, { useState, useEffect } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { BsCheck } from "react-icons/bs";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { themeColors } from "../components/Settings";
import { useStateContext } from "../contexts/ContextProvider";
import Checkbox from '@mui/material/Checkbox';

//Data
import { db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import { updatePlanEnableAirfare, updatePlanEnableLodging, updatePlanEnableBudget } from "../globalFunctions/firebaseGlobals";


const ThemeSettings = () => {
  const {
    setColor,
    setMode,
    currentMode,
    currentColor,
    setThemeSettings,
    currentPlanIsSet,
    currentSelectedPlan,
  } = useStateContext();

  const [plan, setPlan] = useState({});
  const [displayAirfare, setDisplayAirfare] = useState("");

  const handleAirfareChange = (event) => {
    setDisplayAirfare(event.target.value);
  };

  const handleAirfareCheckboxChange = (event) => {
    updatePlanEnableAirfare(currentSelectedPlan, event.target.value);
  };

  const handleLodgingCheckboxChange = (event) => {
    updatePlanEnableLodging(currentSelectedPlan, event.target.value);
  };

  const handleBudgetCheckboxChange = (event) => {
    updatePlanEnableBudget(currentSelectedPlan, event.target.value);
  };

  const setPlanFromContext = async () => {
    try {
      const docRef = doc(db, "plans", currentSelectedPlan);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlan(docSnap.data());
        setDisplayAirfare(docSnap.data().DisplayAirfare);
      }
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (currentPlanIsSet) {
      setPlanFromContext();
    }
    return () => {
      setPlan([]);
    };
  }, []);

  return (
    <>
      <div className="bg-half-transparent w-screen fixed nav-item top-0 right-0">
        <div className="float-right h-screen bg-white w-400">
          <div className="flex justify-between items-center p-4 ml-4">
            <p className="font-semibold text-xl">Settings</p>
            <button
              type="button"
              onClick={() => setThemeSettings(false)}
              style={{ color: "rbg(153, 171, 180)", borderRadius: "50%" }}
              className="text-2xl p-3 hover:drop-shadow-xl hover:bg-light-gray"
            >
              <MdOutlineCancel />
            </button>
          </div>
          {!currentPlanIsSet && (
            <div className="flex-col border-t-1 border-color p-4 ml-4">
              <p className="font-semibold text-lg">Theme Options</p>
              <div className="mt-4">
                <input
                  type="radio"
                  id="light"
                  name="theme"
                  value="Light"
                  className="cursor-pointer"
                  onChange={setMode}
                  checked={currentMode === "Light"}
                />
                <label htmlFor="light" className="ml-2 text-md cursor-pointer">
                  Light
                </label>
              </div>
              <div className="mt-4">
                <input
                  type="radio"
                  id="dark"
                  name="theme"
                  value="Dark"
                  className="cursor-pointer"
                  onChange={setMode}
                  checked={currentMode === "Dark"}
                />
                <label htmlFor="dark" className="ml-2 text-md cursor-pointer">
                  Dark
                </label>
              </div>
            </div>
          )}
          {!currentPlanIsSet && (
            <div className="flex-col border-t-1 border-color p-4 ml-4">
              <p className="font-semibold text-lg">Theme Colors</p>
              <div className="flex gap-3">
                {themeColors.map((item, index) => (
                  <TooltipComponent
                    key={index}
                    content={item.name}
                    position="TopCenter"
                  >
                    <div className="re;atove mt-2 cursor-pointer flex gap-5 items-center">
                      <button
                        type="button"
                        className="h-10 w-10 rounded-full cursor-pointer"
                        style={{ backgroundColor: item.color }}
                        onClick={() => setColor(item.color)}
                      >
                        <BsCheck
                          className={`ml-2 text-2xl text-white ${
                            item.color === currentColor ? "block" : "hidden"
                          }`}
                        />
                      </button>
                    </div>
                  </TooltipComponent>
                ))}
              </div>
            </div>
          )}
          {currentPlanIsSet && (
            <div className="flex-col border-t-1 border-color p-4 ml-4">
              <p className="font-semibold text-lg">Enable Airfare</p>
              <Checkbox 
                onChange={handleAirfareCheckboxChange}
              />
              <p className="font-semibold text-lg">Enable Lodging</p>
              <Checkbox 
                onChange={handleLodgingCheckboxChange}
              />
              <p className="font-semibold text-lg">Enable Budget</p>
              <Checkbox 
                onChange={handleBudgetCheckboxChange}
              />
            </div>
            
          )}
        </div>
      </div>
    </>
  );
};

export default ThemeSettings;
