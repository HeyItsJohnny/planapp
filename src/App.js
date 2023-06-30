import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import {
  Dashboard,
  Calendar,
  ChoreSchedule,
  Ecommerce,
  ColorPicker,
  ChoresConfig,
  ChoresList,
  FamilyMembers,
  FamilyMeals,
  MealScheduler,
  MealSchedulerConfig,
  Planner,
  PlanDetails,
  Scheduler,
  SharedLogins,
  Line,
  Bar,
  Pie,
} from "./pages";

import "./App.css";

import { useStateContext } from "./contexts/ContextProvider";

function App() {
  const { activeMenu, themeSettings, setThemeSettings, currentColor, currentMode } = useStateContext();
  //const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-mai-dark-bg">
          <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
            <TooltipComponent content="Settings" position="top">
              <button
                type="button"
                className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                onClick={() => setThemeSettings(true)}
                style={{ background: currentColor, borderRadius: "50%" }}
              >
                <FiSettings />
              </button>
            </TooltipComponent>
          </div>
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={`dark:bg-main-dark-bg bg-main-bg 
            min-h-screen w-full 
            ${activeMenu ? "md:ml-72" : "flex-2"}`
          
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>

            <div>
              {themeSettings && <ThemeSettings />}
              <Routes>
                {/* DASHBOARD */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* SAMPLE */}
                <Route path="/ecommerce" element={<Ecommerce />} />

                {/* PAGES & APPS */}
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/chore-schedule" element={<ChoreSchedule />} />
                <Route path="/chores-config" element={<ChoresConfig />} />
                <Route path="/chores-list" element={<ChoresList />} />
                <Route path="/color-picker" element={<ColorPicker />} />
                <Route path="/family-members" element={<FamilyMembers />} />
                <Route path="/family-meals" element={<FamilyMeals />} />
                <Route path="/meal-scheduler" element={<MealScheduler />} />
                <Route path="/meal-scheduler-config" element={<MealSchedulerConfig />} />
                <Route path="/planner" element={<Planner />} />
                <Route path="/plandetails/:planid" element={<PlanDetails />} />
                <Route path="/scheduler" element={<Scheduler />} />
                <Route path="/shared-logins" element={<SharedLogins />} />

                {/* CHARTS */}
                <Route path="/line" element={<Line />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
