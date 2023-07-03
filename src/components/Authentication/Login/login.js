import React, { useState, useRef } from "react";
import "./style.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login({ loginToken }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const linkTo = useNavigate();

  const toastId = useRef(null);

  const handleSubmmit = async (e, user) => {
    e.preventDefault();
    const form_data = new FormData();
    form_data.set("username", userName);
    form_data.set("password", password);

    // console.log(form_data.get("username"));
    // console.log(form_data.get("password"));
    toastId.current = toast("Processing", {
      theme: "dark",
      type: "info",
      autoClose: 3000,
      hideProgressBar: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    axios
      .post(process.env.REACT_APP_API + "/User/login", form_data, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((res) => {
        // setProduct(res.data)
        // console.log(res.data);
        if (res.data.result === "Success") {
          //   cookies.set("access_token", res.data.token);
          const d = new Date();
          d.setTime(d.getTime() + 3 * 60 * 60 * 1000);
          let expires = "expires=" + d.toUTCString();
          document.cookie = `access_token=${res.data.token};${expires}`;
          loginToken(res.data.token);
          toast.update(toastId.current, {
            render: "Login success",
            type: "success",
            theme: "dark",
            hideProgressBar: false,
            autoClose: 1500,
          });
          linkTo("/");
        }
      })
      .catch((error) => {
        // console.log("12", error);
        toast.update(toastId.current, {
          render: "Can't login",
          type: "error",
          theme: "dark",
          hideProgressBar: false,
          autoClose: 1500,
        });
      });
  };

  return (
    <div className="Auth-form-container">
      <form
        className="Auth-form"
        onSubmit={handleSubmmit}
        encytpe={"multipart/form-data"}
      >
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>User name</label>
            <input
              type="username"
              className="form-control mt-1"
              placeholder="Enter username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              //   onClick={() => {

              //   }}
            >
              Submit
            </button>
          </div>
          <p className="forgot-password text-right mt-2">
            <a href="register">Create Account</a>
          </p>
        </div>
      </form>
    </div>
  );
}
