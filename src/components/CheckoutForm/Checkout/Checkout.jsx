import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import useStyles from "./styles";
import jwt_decode from "jwt-decode";
const steps = ["Shipping address", "Payment details"];

const Checkout = ({}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const classes = useStyles();
  const [link, setLink] = useState("");
  const [shipData, setShipData] = useState(null);
  const [error, setError] = useState(null);
  const [id_order, setId_Order] = useState("");

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
  const cookies = new Cookies();

  const [token, setToken] = useState(
    cookies.get("access_token") ? cookies.get("access_token") : "NoneLogin"
  );
  const [id_u, setId_u] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).id
      : "NoneLogin"
  );
  const test = (data, addressChoose, shipChoose, is_new) => {
    // console.log(data);
    // console.log(addressChoose);

    const temp = {
      typeShip: shipChoose.type,
      feeShip: shipChoose.fee,
      shipDate: shipChoose.desc,
      addressLine: addressChoose.fullInfo,
      id_province: addressChoose.id_province,
      id_district: addressChoose.id_district,
      id_ward: addressChoose.id_ward,
      house_number:
        is_new === true ? data.housenumber : addressChoose.house_number,
      is_new: is_new,
      serial: addressChoose.serial,
      note: data.noted != undefined ? data.noted : null,
    };
    setShipData(temp);
    // console.log("!!!!", temp);
    // console.log(addressChoose);
    // console.log(shipChoose);

    nextStep();
  };

  let Confirmation = () => (
    // order.customer ? (
    <>
      <div>
        <Typography variant="h5">
          Thank you for your purchase, please pay to complete the order. If the
          payment window doesn't open.
          <br />
          Click <a href={link}>here</a> to open it.
          <br />
          Click <a href={`order/${id_order}`}>here</a> to view order.
          <br />
          <p style={{ color: "#ff6666" }}>
            Noted: You just have 6 hour to payment.
          </p>
        </Typography>
        <Divider className={classes.divider} />
        <Typography variant="subtitle2">
          {/* Order ref: {order.customer_reference} */}
        </Typography>
      </div>
      <br />
      <Button component={Link} variant="outlined" type="button" to="/">
        Back to home
      </Button>
    </>
  );
  // ) : (
  //   <div className={classes.spinner}>
  //     <CircularProgress />
  //   </div>
  // );

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" type="button" to="/">
          Back to home
        </Button>
      </>
    );
  }

  const Form = () =>
    activeStep === 0 ? (
      <AddressForm
        nextStep={nextStep}
        test={test}
        id_user={id_u}
        token={token}
      />
    ) : (
      <PaymentForm
        nextStep={nextStep}
        backStep={backStep}
        shipData={shipData}
        setLink={setLink}
        setError={setError}
        setId_Order={setId_Order}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? <Confirmation /> : <Form />}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
