import React, { useEffect } from "react";
import { Container, Typography, Button, Grid } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";

import CartItem from "./CartItem/CartItem";
import useStyles from "./styles";
import { useState } from "react";
import { formatter } from "../../lib/formatM";
import { useQuery } from "react-query";
import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";
import axios from "axios";
const Cart = ({}) => {
  const classes = useStyles();
  const [listBook, setListBook] = useState([]);
  const cookies = new Cookies();

  const [total, setTotal] = useState(0);
  const [id_u, setId_u] = useState(
    cookies.get("access_token")
      ? jwt_decode(cookies.get("access_token")).id
      : -1
  );
  const [token, setToken] = useState(
    cookies.get("access_token") ? cookies.get("access_token") : -1
  );
  const linkTo = useNavigate();
  const [loadButton, setLoadButton] = useState(false);
  const handleUpdateCartQty = async (
    lineItemIdCart,
    lineItemId,
    quantity,
    total,
    setLoad
  ) => {
    let data = {
      id_user: parseInt(id_u),
      id_cart: lineItemIdCart,
      id_book: lineItemId,
      amount: quantity,
      total: total,
      token: cookies.get("access_token"),
    };
    axios
      .put(process.env.REACT_APP_API + `/Cart/updateCart`, data, {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        setTotal(res.data.total);
        setLoad(false);
        setLoadButton(false);
      });
    // .catch((error) => console.log(error));
  };

  const onRemoveFromCart = (lineItemCart, lineItemId) => {
    // let data = {
    //   id_c: lineItemCart,
    //   id_b: lineItemId,
    // };
    // console.log(data);
    axios
      .delete(
        process.env.REACT_APP_API +
          `/Cart/removeItemCart?id_user=${id_u}&id_cart=${lineItemCart}&id_book=${lineItemId}&token=${cookies.get(
            "access_token"
          )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        setTotal(res.data.total);
        setLoadButton(false);
        let temp = listBook.filter((obj) => {
          return obj.id_book != lineItemId;
        });
        setListBook(temp);
        // console.log("temp: ", temp);
      });
    // .catch((error) => console.log(error));
  };

  const renderEmptyCart = () => (
    <Typography variant="subtitle1">
      You have no items in your shopping cart,
      <Link className={classes.link} to="/">
        {" "}
        start adding some
      </Link>
      !
    </Typography>
  );
  const [refesh, setRefesh] = useState(true);
  // if (!cart) return "Loading";
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
  const products = useQuery(
    ["products", refesh],
    async () => (await axios.get(process.env.REACT_APP_API + `/Book`)).data
  );

  const renderCart = () => (
    <>
      <Grid container spacing={4}>
        {listBook.map((lineItem) => (
          <Grid item xs={12} sm={4} key={lineItem.id_book}>
            <CartItem
              item={lineItem}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={onRemoveFromCart}
              setLoadButton={setLoadButton}
            />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant="h5">
          Subtotal: <b>{formatter.format(total)}</b>
        </Typography>
        <div>
          {/* <Button
              className={classes.emptyButton}
              size="large"
              type="button"
              variant="contained"
              color="secondary"
              // onClick={handleEmptyCart}
            >
              Empty cart
            </Button> */}
          <Button
            className={classes.checkoutButton}
            component={Link}
            to="/checkout"
            size="large"
            type="button"
            variant="contained"
            disabled={loadButton}
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );

  useEffect(() => {
    // console.log("cart: ", cart.data);
    // console.log("products: ", products.data);
    let dataCart = cart.data;
    let dataProducts = products.data;
    if (dataCart && dataProducts) {
      // console.log("Cart and product have data");
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

  return (
    <Container>
      <div className={classes.toolbar} />
      {id_u == -1 && linkTo("/login")}
      {cart.isSuccess == true ? (
        <div>
          <Typography className={classes.title} variant="h5" gutterBottom>
            <b>Your Shopping Cart</b>
          </Typography>
          <hr />
          {listBook.length === 0 ? renderEmptyCart() : renderCart()}
        </div>
      ) : (
        <div>
          <Typography className={classes.title} variant="h5" gutterBottom>
            <b>Loading</b>
          </Typography>
          <hr />
        </div>
      )}
    </Container>
  );
};

export default Cart;
