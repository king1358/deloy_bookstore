import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import { Link, useNavigate, useParams } from "react-router-dom";

import useStyles from "./styles";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";
import { useQuery } from "react-query";
import ReviewId from "./Review";
import Cookies from "universal-cookie";

const OrderId = () => {
  const classes = useStyles();
  const history = useNavigate();
  const cookies = new Cookies();

  const [token, setToken] = useState(
    cookies.get("access_token") ? cookies.get("access_token") : "NoneLogin"
  );
  const [id_u, setId_u] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).id
      : -1
  );
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [listBook, setListBook] = useState([]);
  const [product, setProduct] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [load, setLoad] = useState(true);
  const [fail, setFail] = useState(false);

  const [link, setLink] = useState(true);

  const { id_order } = useParams();
  useEffect(() => {
    // if (orderData.length === 0) setError("No info");
    if (orderData != null && product != null) {
      let itemOrder = orderData.item;
      let dataProducts = product;
      let infoOrder = orderData.info;
      if (itemOrder && dataProducts) {
        // console.log("Cart and product have data");
        let tempData = [];
        itemOrder.map((item) => {
          let infoBook = dataProducts.find(
            (product) => product.id === item.id_book
          );
          let infoItem = {
            name: infoBook.name,
            img: infoBook.img,
            total: item.total,
            amount: item.amount,
            id_book: item.id_book,
            price: infoBook.price,
          };
          tempData = [...tempData, infoItem];
        });
        setTotal(infoOrder.total);
        setListBook(tempData);
        let temp = {
          fullname: infoOrder.fullname,
          feeShip: infoOrder.fee,
          shipInfo: infoOrder.shipInfo,
          address: infoOrder.address,
          status: infoOrder.status,
          linkCheckOut: infoOrder.linkCheckOut,
        };
        setLink(temp.linkCheckOut);
        setOrderInfo(temp);
      }
    }
  }, [orderData, product]);

  useEffect(() => {
    if (orderInfo) {
      // console.log(orderInfo);
      setLoad(false);
    }
  }, [orderInfo]);

  const getBook = (id_district) => {
    axios.get(process.env.REACT_APP_API + `/Book`).then((res) => {
      setProduct(res.data);
    });
  };

  const getOrder = (id_order) => {
    const id_user = parseInt(id_u);
    axios
      .get(
        process.env.REACT_APP_API +
          `/Order/InfoOrder?id_order=${id_order}&token=${token}&id_user=${id_user}`
      )
      .then((res) => {
        // console.log(res.data.data);
        setOrderData(res.data.data);
      })
      .catch((error) => {
        // console.log(error.response);
        if (error.response.data.result === "fail") {
          setFail(true);
          setError(error.response.data.message);
        }
      });
  };
  useEffect(() => {
    getBook();
    getOrder(id_order);
  }, []);

  return (
    <>
      {load === false ? (
        <>
          <CssBaseline />
          <div className={classes.toolbar} />
          <main className={classes.layout}>
            <Paper className={classes.paper}>
              <Typography variant="h4" align="center">
                Info Order
              </Typography>
              <div>
                <Typography variant="h6" align="center">
                  Fullname: {orderInfo.fullname}
                </Typography>
                <Typography variant="h6" align="center">
                  Ship To: {orderInfo.address}
                </Typography>
                <Typography variant="h6" align="center">
                  Info ship: {orderInfo.shipInfo}
                </Typography>
                <Typography variant="h6" align="center">
                  Status: {orderInfo.status}
                </Typography>

                {orderInfo.status === "Waiting payment" && (
                  <Typography variant="h6" align="center">
                    Link payment:{" "}
                    <a href={link} style={{ color: "#ff6666" }}>
                      {"here "}
                    </a>
                  </Typography>
                )}
              </div>

              <ReviewId
                listBook={listBook}
                total={total}
                shipFee={orderInfo.feeShip}
              />
            </Paper>
          </main>
        </>
      ) : (
        <>
          {fail ? (
            <>
              <CssBaseline />
              <div className={classes.toolbar} />
              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <Typography variant="h4" align="center">
                    Info Order
                  </Typography>
                  <div>
                    <Typography variant="h6" align="center">
                      {error}
                    </Typography>
                  </div>
                </Paper>
              </main>
            </>
          ) : (
            <>
              <CssBaseline />
              <div className={classes.toolbar} />
              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <Typography variant="h4" align="center">
                    Info Order
                  </Typography>
                  <div>
                    <Typography variant="h6" align="center">
                      Loading
                    </Typography>
                  </div>
                </Paper>
              </main>
            </>
          )}
        </>
      )}
    </>
  );
};

export default OrderId;
