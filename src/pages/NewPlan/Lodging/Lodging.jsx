import React from "react";
import { Header } from "../../../components";

import { useStateContext } from "../../../contexts/ContextProvider";
import MealListComponent from "./MealListComponent";
import SiteListComponent from "./SiteListComponent";
import LodgingComponent from "./LodgingComponent";

const Lodging = ({ lodgingNext, backStep, sitesData, mealsData }) => {
  const { currentColor } = useStateContext();

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="Lodging" />
        <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "White",
            borderRadius: "10px",
          }}
          className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
          onClick={backStep}
        >
          Back
        </button>
        <button
          type="button"
          style={{
            backgroundColor: currentColor,
            color: "White",
            borderRadius: "10px",
          }}
          className={`text-md p-3 hover:drop-shadow-xl mb-5 mr-5`}
          onClick={lodgingNext}
        >
          Next
        </button>
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="flex gap-10 flex-wrap justify-center">
          <LodgingComponent lodgingNext={lodgingNext} backStep={backStep}/>
          <MealListComponent mealsData={mealsData}/>
          <SiteListComponent sitesData={sitesData}/>
        </div>
      </div>
    </>
  );
};

export default Lodging;
