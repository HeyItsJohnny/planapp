import React, { useEffect } from "react";
import { Header } from "../../../components";

import { Typography, Button } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

import ReviewLodgingComponent from "./ReviewLodgingComponent";
import ReviewSiteComponent from "./ReviewSiteComponent";
import ReviewMealComponent from "./ReviewMealComponent";
import ReviewItineraryComponent from "./ReviewItineraryComponent";

const ReviewPlan = ({ detailsData, sitesData, mealsData, lodgingData }) => {
  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category={detailsData.Destination} title="Itinerary" />
      </div>
      <div className="flex gap-10 flex-wrap justify-center">
        <div className="flex gap-10 flex-wrap justify-center">
          <ReviewLodgingComponent lodgingData={lodgingData} />
          <ReviewSiteComponent sitesData={sitesData} />
          <ReviewMealComponent mealsData={mealsData} />
        </div>
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="Itinerary" />
        <ReviewItineraryComponent
          detailsData={detailsData}
          sitesData={sitesData}
          mealsData={mealsData}
          lodgingData={lodgingData}
        />
      </div>
    </>
  );
};

export default ReviewPlan;
