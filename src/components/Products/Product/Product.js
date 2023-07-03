import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  CardActionArea,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import { Link } from "react-router-dom";
import useStyles from "./styles";
import { formatter } from "../../../lib/formatM";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const Product = ({ product, onAddToCart }) => {
  const classes = useStyles();
  const cookies = new Cookies();

  return (
    <Card className={classes.root}>
      <Link to={`product-view/${product.id}`}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={product.img}
            title={product.name}
          />
        </CardActionArea>
      </Link>
      <CardContent>
        <div className={classes.cardContent}>
          <Typography variant="h6">{product.name}</Typography>
          <Typography variant="h6" color="secondary">
            <b>{formatter.format(product.price)}</b>
          </Typography>
        </div>
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions}>
        <Button
          variant="contained"
          className={classes.button}
          endIcon={<AddShoppingCart />}
          onClick={() => {
            let token = cookies.get("access_token");
            if (token) onAddToCart(product.id, 1);
            else {
              toast("Login to add item", {
                type: "warning",
                theme: "dark",
                hideProgressBar: false,
                autoClose: 1500,
              });
            }
          }}
        >
          <b>ADD TO CART</b>
        </Button>
      </CardActions>
    </Card>
  );
};

export default Product;
