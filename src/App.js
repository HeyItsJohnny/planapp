import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import {
  Dashboard,
  Calendar,
  Ecommerce,
  PeopleInvited,
  Places,
  Food,
  Scheduler,
  Itinerary,
  TripCostsBreakdown,
  TripCosts,
  ChatGPTExample,
  TripPayments,
  PlanSummary,
  Plans,
  PlanFood,
  PlanActivities,
  PlanSettings,
  PlanBudget,
  PreTripToDo
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
                {/* DASHBOARD AND STATIC HOMEPAGES*/}
                <Route path="/" element={<Plans />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/dashboard" element={<Dashboard />} />

                {/* PLAN SPECIFIC PAGES */}
                <Route path="/plansummary" element={<PlanSummary />} />
                <Route path="/planitinerary" element={<Itinerary />} />
                <Route path="/planbudget" element={<PlanBudget />} />
                <Route path="/planfood" element={<PlanFood />} />
                <Route path="/planactivities" element={<PlanActivities />} />
                <Route path="/plansettings" element={<PlanSettings />} />
                <Route path="/pretriptodo" element={<PreTripToDo />} />

                {/* SAMPLE */}
                <Route path="/ecommerce" element={<Ecommerce />} />

                {/* PAGES & APPS */}
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/food" element={<Food />} />
                <Route path="/places" element={<Places />} />
                <Route path="/trip-costs" element={<TripCosts />} />
                <Route path="/trip-payments" element={<TripPayments />} />
                <Route path="/trip-costs-breakdown" element={<TripCostsBreakdown />} />
                <Route path="/people-invited" element={<PeopleInvited />} />
                <Route path="/scheduler" element={<Scheduler />} />
                <Route path="/chatgpt" element={<ChatGPTExample />} />

              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
