import React, { useState, useEffect } from "react";

//DATA
import { Header } from "../../components";
import ItineraryAirfare from "./ItineraryAirfare";
import ItineraryHousing from "./ItineraryHousing";

const Itinerary = () => {
  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="Plan" title="Itinerary" />
      </div>
      <ItineraryAirfare />
      <ItineraryHousing />
    </>
  );
};

export default Itinerary;