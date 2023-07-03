import React from "react";
import { Typography, Button, Divider } from "@material-ui/core";
import { useQuery } from "react-query";
import Review from "./Review";
import { useState } from "react";
import axios from "axios";
import { formatter } from "../../lib/formatM";
import { InputLabel, MenuItem, Grid } from "@material-ui/core";
import Select from "react-select";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

const PaymentForm = ({
  nextStep,
  backStep,
  shipData,
  setLink,
  setError,
  setId_Order,
}) => {
  const cookies = new Cookies();

  const [id_u, setId_u] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).id
      : -1
  );
  const [token, setToken] = useState(
    cookies.get("access_token") ? cookies.get("access_token") : -1
  );
  const [fullname, setFullname] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).fullname
      : "NO"
  );
  // if (!cart) return "Loading";
  const [refesh, setRefesh] = useState(false);
  const linkTo = useNavigate();

  const products = useQuery(
    ["products", refesh],
    async () => (await axios.get(process.env.REACT_APP_API + `/Book`)).data
  );
  const cart = useQuery(
    ["cart", refesh],
    async () =>
      (
        await axios.get(
          process.env.REACT_APP_API + `/Cart?id=${id_u}&token=${token}`
        )
      ).data,
    {
      refetchInterval: 360000,
    }
  );
  const [dataBook, setDataBook] = useState([]);
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault();
    // console.log(listBook);
    // console.log(dataBook);
    if (dataBook.length > 0) {
      const checkoutData = {
        id_user: parseInt(id_u),
        token: token,
        item: {
          data: dataBook,
          total: `${total + shipData.feeShip}`,
        },
        ship: {
          fullname: fullname,
          address: {
            address_line: shipData.addressLine,
            id_province: shipData.id_province,
            id_district: shipData.id_district,
            id_ward: shipData.id_ward,
            house_number: shipData.house_number,
            serial: shipData.serial,
            is_new: shipData.is_new,
          },
          infoShip: {
            feeShip: `${shipData.feeShip}`,
            typeShip: shipData.typeShip,
            shipInfo: shipData.shipDate,
            note: shipData.note,
          },
        },
        payment: paymentChoose.value,
      };
      // console.log("AAAAA", checkoutData);
      axios
        .post(process.env.REACT_APP_API + "/Order/Order", checkoutData, {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.result === "success") {
            let link = res.data.link;
            setLink(link);
            setId_Order(res.data.id_order);
            window.open(link, "_blank");
          } else {
            setError("Error while create payment");
          }
        })
        .catch((error) => {
          // console.log(res);

          setError("Error while create payment");
        });

      nextStep();
    }

    // console.log(orderData);

    // }
  };

  const [paymentMethod, setPaymentMethod] = useState([]);
  const [paymentChoose, setPaymentChoose] = useState(null);
  const [optionPayment, setOptionPayment] = useState([]);

  const getPaymentMethod = () => {
    axios
      .get(process.env.REACT_APP_API + "/Order/PaymentMethod")
      .then((res) => {
        setPaymentMethod(res.data);
      });
  };
  useEffect(() => {
    getPaymentMethod();
    // console.log(shipData);
  }, []);

  const [total, setTotal] = useState(0);
  const [listBook, setListBook] = useState([]);
  useEffect(() => {
    let dataCart = cart.data;
    let dataProducts = products.data;

    // if (dataCart == null) setError("Please add book to cart");
    if (dataCart && dataProducts) {
      console.log("Cart and product have data");
      console.log(dataCart);
      let tempData = [];
      dataCart.cart.map((item) => {
        let infoBook = dataProducts.find(
          (product) => product.id === item.id_book
        );
        let infoItem = {
          name: infoBook.name,
          img: infoBook.img,
          total: item.total,
          amount: item.amount,
          id_book: item.id_book,
          id_cart: item.id_cart,
          price: infoBook.price,
        };
        tempData = [...tempData, infoItem];
      });
      setTotal(dataCart.total);
      setListBook(tempData);
      // console.log(tempData);
    }
  }, [cart.data, products.data]);

  useEffect(() => {
    if (listBook.length > 0) {
      listBook.map((book) => {
        const data = {
          id_book: book.id_book,
          name: book.name,
          quantity: `${book.amount}`,
          unit_amount: {
            currency_code: "USD",
            value: `${book.price}`,
          },
        };
        setDataBook((oldData) => [...oldData, data]);
      });
    }
  }, [listBook]);

  const createOption = (fullInfo, index) => ({
    label: fullInfo,
    value: index,
  });
  useEffect(() => {
    if (paymentMethod) {
      for (let i = 0; i < paymentMethod.length; i++) {
        const temp = createOption(paymentMethod[i].name, paymentMethod[i].id);
        if (i == 0) setPaymentChoose(temp);
        setOptionPayment((oldData) => [...oldData, temp]);
      }
    }
  }, [paymentMethod]);
  useEffect(() => {
    console.log("AAAAA");
  }, []);
  return (
    <>
      {cart.isSuccess ? (
        <>
          <Review
            listBook={listBook}
            total={total}
            shipFee={shipData.feeShip}
          />
          <Divider />
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Order summary
            </Typography>
            <div
              style={{
                width: "141px",
                marginBottom: "7px",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <Select
                value={paymentChoose}
                fullWidth
                onChange={(changeValue) => {
                  setPaymentChoose(changeValue);
                }}
                options={optionPayment}
              />
            </div>
          </Grid>

          <form onSubmit={(e) => handleSubmit(e)}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="outlined" onClick={backStep}>
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                style={{ backgroundColor: "#1C2331", color: "#FFFF" }}
              >
                Pay: <b>{formatter.format(cart.data.total)}</b>
              </Button>
            </div>
          </form>
        </>
      ) : cart.isError === false ? (
        <>
          <Typography style={{ marginTop: "3%" }} variant="h5" gutterBottom>
            <b>Loadings</b>
          </Typography>
        </>
      ) : (
        <>
          <Typography style={{ marginTop: "3%" }} variant="h5" gutterBottom>
            <b>Login to use this</b>
          </Typography>
        </>
      )}
    </>
  );
};

export default PaymentForm;
