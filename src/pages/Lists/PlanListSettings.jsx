import React from "react";

//VISUAL
import PlanCalendarListSettings from "./PlanCalendarListSettings";
import PlanToDoListSettings from "./PlanToDoListSettings";

const PlanListSettings = () => {
  return (
    <>
      <PlanToDoListSettings />
      <PlanCalendarListSettings />
    </>
  );
};

export default PlanListSettings;
