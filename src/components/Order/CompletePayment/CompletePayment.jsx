import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Paper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  Stepper,
} from "@material-ui/core";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useStyles from "./styles";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Cookies from "universal-cookie";

const CompletePayment = () => {
  const classes = useStyles();
  const history = useNavigate();
  const cookies = new Cookies();

  const [tokenUser, setTokenUser] = useState(
    cookies.get("access_token") ? cookies.get("access_token") : "NoneLogin"
  );
  const [id_u, setId_u] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).id
      : "NoneLogin"
  );

  const [tokenParams, setTokehParams] = useSearchParams();
  const [payerIdParams, setPayerIdParams] = useSearchParams();

  const [load, setLoad] = useState(true);
  const [id_order, setIdOrder] = useState(-1);
  const postApiConfirmPayment = (token, payerId) => {
    axios
      .get(
        process.env.REACT_APP_API +
          `/Order/ConfirmPayment?token=${token}&PayerID=${payerId}`
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data.result === "success") {
          setIdOrder(res.data.id_order);
          setLoad(false);
        } else {
        }
      });
  };

  useEffect(() => {
    const token = tokenParams.get("token");
    const payerId = payerIdParams.get("PayerID");
    postApiConfirmPayment(token, payerId);
  }, []);

  return (
    <div style={{ margin: "auto" }}>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Payment
          </Typography>
          <Divider className={classes.divider} />
          {load === true ? (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Loading
            </Typography>
          ) : (
            <Typography variant="h5" style={{ textAlign: "center" }}>
              Thank you for your payment, your order is being prepared to be
              sent to you.
              <br />
              Click <a href={`/order/${id_order}`}>here</a> to view order.
            </Typography>
          )}
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            {/* Order ref: {order.customer_reference} */}
          </Typography>
          <br />
          <Button component={Link} variant="outlined" type="button" to="/">
            Back to home
          </Button>
        </Paper>
      </main>
    </div>
  );
};

export default CompletePayment;
