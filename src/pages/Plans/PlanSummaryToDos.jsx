import React, { useState, useEffect } from "react";

//DATA
import { Header } from "../../components";

const PlanSummaryToDos = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Plan" title="To Dos" />
    </div>
  );
};

export default PlanSummaryToDos;
