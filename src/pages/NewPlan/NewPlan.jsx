import React, { useState } from "react";
import { Header } from "../../components";
import { useStateContext } from "../../contexts/ContextProvider";
import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";

import { Link, useHistory } from "react-router-dom";

import Details from "./Details";
import Sites from "./Sites";
import Meals from "./Meals";
import Lodging from "./Lodging";

const steps = ["Details", "Sites", "Meals", "Lodging/Starting"];

const NewPlan = () => {
  const [activeStep, setActiveStep] = useState(0);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    nextStep();
  };

  const Confirmation = () => (
    <>
      <div>
        <Typography variant="h5">Review Plan</Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">
        Back to home
      </Button>
    </>
  );

  function getStepContent() {
    switch (activeStep) {
      case 0:
        return <Details nextStep={nextStep} />;
      case 1:
        return <Sites nextStep={nextStep} backStep={backStep} />;
      case 2:
        return <Meals nextStep={nextStep} backStep={backStep} />;
      case 3:
        return <Lodging nextStep={nextStep} backStep={backStep} />;
      default:
        return <h1>Something went wrong.</h1>;
    }
  }

  return (
    <>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        <Header category="" title="New Plan" />
        <Stepper activeStep={activeStep} className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg">
          {steps.map((step) => (
            <Step key={step}>
              <StepLabel>
                <div className="text-slate-900 dark:text-gray-200">{step}</div>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-3xl">
        {activeStep === steps.length ? <Confirmation /> : getStepContent()}
      </div>
    </>
  );
};

export default NewPlan;
