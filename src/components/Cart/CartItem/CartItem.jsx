import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
} from "@material-ui/core";

import useStyles from "./styles";
import { formatter } from "../../../lib/formatM";
const CartItem = ({
  item,
  onUpdateCartQty,
  onRemoveFromCart,
  setLoadButton,
}) => {
  const classes = useStyles();
  const [amount, setAmount] = useState(item.amount);
  const [total, setTotal] = useState(item.total);
  const [load, setLoad] = useState(false);
  const handleUpdateCartQty = (lineItemCart, lineItemId, newQuantity) => {
    if (newQuantity > 0) {
      setTotal(newQuantity * item.price);
      setLoad(true);
      setLoadButton(true);
      onUpdateCartQty(
        lineItemCart,
        lineItemId,
        newQuantity,
        newQuantity * item.price,
        setLoad
      );
    } else {
      setLoad(true);
      handleRemoveFromCart(lineItemCart, lineItemId);
    }
  };
  const handleRemoveFromCart = (lineItemCart, lineItemId) => {
    setLoadButton(true);
    onRemoveFromCart(lineItemCart, lineItemId);
  };

  return (
    <Card className="cart-item">
      <CardMedia image={item.img} alt={item.name} className={classes.media} />
      <CardContent className={classes.cardContent}>
        <Typography variant="h6">{item.name}</Typography>
        <Typography variant="h6" color="secondary">
          {formatter.format(total)}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <div className={classes.buttons}>
          <Button
            type="button"
            size="small"
            onClick={() => {
              handleUpdateCartQty(item.id_cart, item.id_book, item.amount - 1);
              setAmount(item.amount - 1);
              item.amount = item.amount - 1;
            }}
            disabled={load}
          >
            -
          </Button>
          <Typography>&nbsp;{amount}&nbsp;</Typography>
          <Button
            type="button"
            size="small"
            onClick={() => {
              handleUpdateCartQty(item.id_cart, item.id_book, item.amount + 1);
              setAmount(item.amount + 1);
              item.amount = item.amount + 1;
            }}
            disabled={load}
          >
            +
          </Button>
        </div>
        <Button
          className={classes.button}
          variant="contained"
          type="button"
          color="secondary"
          onClick={() => handleRemoveFromCart(item.id_cart, item.id_book)}
        >
          Remove
        </Button>
      </CardActions>
    </Card>
  );
};

export default CartItem;
