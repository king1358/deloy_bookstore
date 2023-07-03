import React, { useState, useEffect } from "react";
import { CssBaseline } from "@material-ui/core";
import Products from "./components/Products/Products";
import Navbar from "./components/Navbar/Navbar";
import Cart from "./components/Cart/Cart";
import Checkout from "./components/CheckoutForm/Checkout/Checkout";
import ProductView from "./components/ProductView/ProductView";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import axios from "axios";
import Login from "./components/Authentication/Login/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "react-query";
import Register from "./components/Authentication/Register/register";
import CompletePayment from "./components/Order/CompletePayment/CompletePayment";
import OrderId from "./components/Order/OrderId/OrderId";
import ListOrder from "./components/Order/ListOrder/listOrder";
const App = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [token, setToken] = useState("");

  const loginToken = (result) => {
    // console.log(result);
    setToken(result);
  };

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Router>
          <div style={{ display: "flex" }}>
            <CssBaseline />
            <Navbar
              totalItems={cart.total_items}
              handleDrawerToggle={handleDrawerToggle}
            />
            <Routes>
              <Route exact path="/" element={<Products />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route path="/checkout" exact element={<Checkout />} />
              <Route
                path="/completePayment"
                exact
                element={<CompletePayment />}
              />
              <Route path="/order" exact element={<ListOrder />} />

              <Route path="/order/:id_order" exact element={<OrderId />} />

              <Route path="/product-view/:id" exact element={<ProductView />} />

              <Route
                path="/login"
                exact
                element={<Login loginToken={loginToken} />}
              />
              <Route path="/register" exact element={<Register />} />
            </Routes>
            <ToastContainer />
          </div>
        </Router>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default App;
