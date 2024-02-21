import React, { useState } from "react";
import { Header } from "../../components";
import { Stepper, Step, StepLabel } from "@material-ui/core";

import NewTripSelection from "./NewTripSelection";
import NewTripDetails from "./NewTripDetails";

const steps = ["Trip Type", "Details"];

const NewTrip = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tripType, setTripType] = useState("");
  const [tripDetails, setTripDetails] = useState({});
  const [tripCategory, setTripCategory] = useState("");

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const tripTypeNext = (type) => {
    setTripType(type);
    nextStep();
  };

  const detailsNext = (data,category) => {
    const detailValues = {
        Destination: data.target.Destination.value,
        StartDate: data.target.StartDate.value,
        EndDate: data.target.EndDate.value,
      };
    setTripDetails(detailValues);
    setTripCategory(category);
    console.log(detailValues);
    console.log(category);
    nextStep();
  };

  const Confirmation = () => (
    <>
      <Header category="CONFIRMATION" title="New Plan" />
      {/*
      <ReviewPlan
        detailsData={detailsData}
        sitesData={sitesData}
        mealsData={mealsData}
        lodgingData={lodgingData}
      />
    */}
    </>
  );

  function getStepContent() {
    switch (activeStep) {
      case 0:
        return <NewTripSelection tripTypeNext={tripTypeNext} />;
      case 1:
        return (
          <NewTripDetails
            detailsNext={detailsNext}
            backStep={backStep}
          />
        );
      default:
        return <h1>Something went wrong.</h1>;
    }
  }

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="New Trip" />
        <Stepper
          activeStep={activeStep}
          className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg"
        >
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>
                <div className="text-slate-900 dark:text-gray-200">{step}</div>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      {activeStep === steps.length ? <Confirmation /> : getStepContent()}
    </>
  );
};

export default NewTrip;