import React, { useState, useEffect } from "react";

//CONTEXT
import { useStateContext } from "../../contexts/ContextProvider";

//DATA
import { Header } from "../../components";
import ItineraryAirfare from "./ItineraryAirfare";
import ItineraryLodging from "./ItineraryLodging";

const Itinerary = () => {
  const {
    enableAirfare,
    enableLodging
  } = useStateContext();

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Plan" title="Itinerary" />
        <p>Add Space to add in everyday calendar events</p>
        <p>Also Add in Itinerary Calendar</p>
      </div>
      {enableAirfare && <ItineraryAirfare />}
      {enableLodging && <ItineraryLodging />}
    </>
  );
};

export default Itinerary;
