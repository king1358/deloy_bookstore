import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { AccountCircle, ExitToApp, Description } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/circles.png";
import useStyles from "./styles";
import jwt_decode from "jwt-decode";
import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useState } from "react";
const Navbar = ({ totalItems }) => {
  const classes = useStyles();
  const location = useLocation();
  const [decode, setDecode] = useState({ username: "", fullname: "" });
  const [show, setShow] = useState(false);
  const cookies = new Cookies();

  useEffect(() => {
    const token = cookies.get("access_token");
    // console.log("token", token);
    if (token != null) setDecode(jwt_decode(token));
    else decode.username = "";
  }, []);

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography
            component={Link}
            to="/"
            variant="h5"
            className={classes.title}
            color="inherit"
          >
            <img
              src={logo}
              alt="Book Store App"
              height="50px"
              className={classes.image}
            />
            <strong>BooK-IT</strong>
          </Typography>

          <div className={classes.grow} />
          {/* {location.pathname === '/' && ( */}
          <div className={classes.button}>
            <IconButton
              component={Link}
              to={`/cart`}
              aria-label="Show cart items"
              color="inherit"
            >
              <Badge badgeContent={totalItems} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            {!cookies.get("access_token") ? (
              <IconButton
                component={Link}
                to="/login"
                aria-label="Show cart items"
                color="inherit"
              >
                <Badge badgeContent={totalItems} color="secondary">
                  <AccountCircle />
                </Badge>
              </IconButton>
            ) : (
              <div style={{ position: "relative", display: "inline-block" }}>
                <IconButton
                  component={Link}
                  aria-label="Show cart items"
                  color="inherit"
                  onClick={() => {
                    setShow(!show);
                  }}
                  // onBlur={() => {
                  //   setShow(false);
                  // }}
                >
                  <Badge badgeContent={totalItems} color="secondary">
                    <AccountCircle />
                  </Badge>
                </IconButton>
                {show && (
                  <div className={classes.dropdownContent}>
                    <div style={{ marginTop: "15px" }}>
                      <a style={{ display: "flex" }} href="/order">
                        <Description />
                        <p style={{ fontSize: "19px", marginLeft: "11px" }}>
                          Order list
                        </p>
                      </a>
                    </div>
                    <div style={{ marginTop: "15px" }}>
                      <a
                        style={{ display: "flex" }}
                        onClick={() => {
                          cookies.remove("access_token");
                        }}
                        href="/"
                      >
                        <ExitToApp />
                        <p style={{ fontSize: "19px", marginLeft: "11px" }}>
                          Sign out
                        </p>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
