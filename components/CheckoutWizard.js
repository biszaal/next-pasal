import { Step, StepLabel, Stepper } from "@material-ui/core";
import React from "react";
import useStyles from "../utils/styles";

const CheckoutWizard = ({ activeStep = 0 }) => {
  const classes = useStyles();
  const stepperSet = [
    "Login",
    "Shipping, Address",
    "Payment Method",
    "place Order",
  ];
  return (
    <Stepper
      className={classes.transparentBackground}
      activeStep={activeStep}
      alternativeLabel
    >
      {stepperSet.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default CheckoutWizard;
