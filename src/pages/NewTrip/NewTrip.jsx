import React, { useState } from "react";
import { Header } from "../../components";
import { Stepper, Step, StepLabel } from "@material-ui/core";

import NewTripSelection from "./NewTripSelection";
import NewTripDetails from "./NewTripDetails";
import NewTripConfirmation from "./Confirmation/NewTripConfirmation";
import NewTripWakeUpBedTimes from "./NewTripWakeUpBedTimes";

const steps = ["Trip Type", "Details", "Wake up and Bed Times"];

const NewTrip = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [tripType, setTripType] = useState("");
  const [tripDetails, setTripDetails] = useState({});
  const [tripTimeDetails, setTripTimeDetails] = useState({});

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const tripTypeNext = (type) => {
    setTripType(type);
    nextStep();
  };

  const detailsNext = (data, category, destination) => {
    const detailValues = {
      Destination: destination,
      TripType: tripType,
      StartDate: data.target.StartDate.value,
      EndDate: data.target.EndDate.value,
      Category: category,
    };
    setTripDetails(detailValues);
    nextStep();
  };

  const timesNext = (data) => {
    const timeValues = {
      WakeUpTime: data.target.WakeUpTime.value,
      BedTime: data.target.BedTime.value,
    };
    setTripTimeDetails(timeValues);
    nextStep();
  };

  const Confirmation = () => (
    <>
      <NewTripConfirmation tripDetails={tripDetails} tripTimeDetails={tripTimeDetails}/>
    </>
  );

  function getStepContent() {
    switch (activeStep) {
      case 0:
        return <NewTripSelection tripTypeNext={tripTypeNext} />;
      case 1:
        return <NewTripDetails detailsNext={detailsNext} backStep={backStep} />;
      case 2:
        return (
          <NewTripWakeUpBedTimes timesNext={timesNext} backStep={backStep} />
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
