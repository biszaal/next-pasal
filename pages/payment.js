import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { Store } from "../utils/Store";
import Layout from "../components/Layout";
import CheckoutWizard from "../components/CheckoutWizard";
import useStyles from "../utils/styles";
import {
  Button,
  FormControl,
  FormControlLabel,
  List,
  ListItem,
  Radio,
  RadioGroup,
  Typography,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

const Payment = () => {
  const classes = useStyles();
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push("/shipping");
    } else {
      setPaymentMethod(Cookies.get("paymentMethod") || "");
    }
  }, []);

  const submitHandler = (e) => {
    setError("");
    e.preventDefault();
    if (!paymentMethod) {
      setError("Payment Method is required.");
    } else {
      dispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethod });
      Cookies.set("paymentMethod", paymentMethod);
      router.push("/placeorder");
    }
  };

  return (
    <Layout title="Payment Method">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={Boolean(error)}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <MuiAlert
          variant="filled"
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </MuiAlert>
      </Snackbar>
      <CheckoutWizard activeStep={2} />
      <form className={classes.form} onSubmit={submitHandler}>
        <Typography component="h1" variant="h1">
          Payment Method
        </Typography>
        <List>
          <ListItem>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="Payment Method"
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  label="PayPal"
                  value="PayPal"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Stripe"
                  value="Stripe"
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Cash"
                  value="Cash"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </ListItem>
          <ListItem>
            <Button fullWidth type="submit" variant="contained" color="primary">
              Continue
            </Button>
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              type="button"
              variant="contained"
              onClick={() => router.push("/shipping")}
            >
              Back
            </Button>
          </ListItem>
        </List>
      </form>
    </Layout>
  );
};


export default Payment;
