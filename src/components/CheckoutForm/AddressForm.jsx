import React, { useState, useEffect } from "react";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";

import { commerce } from "../../lib/commerce";
import {
  FormInput,
  SelectInput,
  CreatableSelectInput,
} from "./CustomTextField";
import axios from "axios";

const AddressForm = ({ test, addressUser, id_user, token }) => {
  const methods = useForm();
  const [addressChoose, setAddressChoose] = useState(null);
  const [listAddress, setListAddress] = useState(null);
  const [shipMethod, setShipMethod] = useState("");
  const [payment, setPayment] = useState("");
  const [dataProvinces, setDataProvinces] = useState([]);
  const [dataDistrict, setDataDistrict] = useState([]);
  const [dataWard, setDataWard] = useState([]);
  const [provinceChoose, setProvinceChoose] = useState(null);
  const [districtChoose, setDistrictChoose] = useState(null);
  const [wardChoose, setWardChoose] = useState(null);
  const [infoShip, setInfoShip] = useState(null);
  const [cart, setCart] = useState(null);
  const [check, setCheck] = useState(null);
  const [error, setError] = useState("");
  const [newAddress, setNewAddress] = useState(null);

  const getCart = () => {
    axios
      .get(process.env.REACT_APP_API + `/Cart?id=${id_user}&token=${token}`)
      .then((res) => {
        // console.log("ACXC", res.data.cart.length);
        if (res.data.cart.length === 0) {
          setError("Add book to cart");
        }
      });
  };

  const getProvince = () => {
    axios.get(process.env.REACT_APP_API + "/User/Province").then((res) => {
      setDataProvinces(res.data);
    });
  };
  const getDistrict = (id_province) => {
    axios
      .get(
        process.env.REACT_APP_API + `/User/District?id_province=${id_province}`
      )
      .then((res) => {
        setDataDistrict(res.data);
      });
  };
  const getWard = (id_district) => {
    axios
      .get(process.env.REACT_APP_API + `/User/Ward?id_district=${id_district}`)
      .then((res) => {
        setDataWard(res.data);
      });
  };
  const getAddressUser = (id_user, token) => {
    axios
      .get(
        process.env.REACT_APP_API +
          `/User/AddressUser?id_user=${id_user}&token=${token}`
      )
      .then((res) => {
        setListAddress(res.data);
      });
  };

  const getInfoShip = (id_province, id_district, id_ward) => {
    axios
      .get(
        process.env.REACT_APP_API +
          `/Order/GetShipInfo?id_province=${id_province}&id_district=${id_district}&id_ward=${id_ward}`
      )
      .then((res) => {
        setInfoShip(res.data);
      });
  };

  useEffect(() => {
    getAddressUser(id_user, token);
    getProvince();
  }, []);

  useEffect(() => {
    getCart();
  }, [check]);

  useEffect(() => {
    if (provinceChoose) {
      setDistrictChoose(null);
      setWardChoose(null);
      getDistrict(provinceChoose.value);
      setOptionShip([]);
      setShipChoose(null);
      // console.log("SSSSS", provinceChoose);
    } else {
      setDistrictChoose(null);
      setWardChoose(null);
      setDataDistrict([]);
      setDataWard([]);
      // console.log("AAAA");
      setOptionShip([]);
      setShipChoose(null);
    }
  }, [provinceChoose]);
  useEffect(() => {
    if (districtChoose) {
      setWardChoose(null);
      getWard(districtChoose.value);
      setOptionShip([]);
      setShipChoose(null);
    } else {
      setWardChoose(null);
      setDataWard([]);
      setOptionShip([]);
      setShipChoose(null);
    }
  }, [districtChoose]);

  useEffect(() => {
    if (wardChoose) {
      // setShipChoose(null);
      setOptionShip([]);
      setShipChoose(null);
      getInfoShip(provinceChoose.value, districtChoose.value, wardChoose.value);
      const temp = {
        id_province: provinceChoose.value,
        id_district: districtChoose.value,
        id_ward: wardChoose.value,
      };
      setNewAddress(temp);
    } else {
      setOptionShip([]);
      setShipChoose(null);
    }
  }, [wardChoose]);

  useEffect(() => {
    if (dataProvinces) {
      //console.log("AAAA");
      let i;
      for (i = 0; i < dataProvinces.length; i++) {
        dataProvinces[i].value = dataProvinces[i]["id_province"];
        dataProvinces[i].label = dataProvinces[i]["name"];
        delete dataProvinces[i].id_province;
        delete dataProvinces[i].name;
      }
      //console.log("Province", dataProvinces);
      // //console.log(options);
    }
  }, [dataProvinces]);

  useEffect(() => {
    if (dataDistrict) {
      //console.log("AAAA");
      let i;
      for (i = 0; i < dataDistrict.length; i++) {
        dataDistrict[i].value = dataDistrict[i]["id_district"];
        dataDistrict[i].label = dataDistrict[i]["name"];
        delete dataDistrict[i].id_district;
        delete dataDistrict[i].name;
      }
      //console.log(dataDistrict);
    }
  }, [dataDistrict]);

  useEffect(() => {
    if (dataWard) {
      //console.log("AAAA");
      let i;
      for (i = 0; i < dataWard.length; i++) {
        dataWard[i].value = dataWard[i]["id_ward"];
        dataWard[i].label = dataWard[i]["name"];
        delete dataWard[i].id_ward;
        delete dataWard[i].name;
      }
      //console.log(dataWard);
    }
  }, [dataWard]);

  useEffect(() => {
    if (addressChoose) {
      // console.log("WSADASDSDWASXXXX", addressChoose);
      if (addressChoose.value != -1) {
        getInfoShip(
          listAddress[addressChoose.value].id_province,
          listAddress[addressChoose.value].id_district,
          listAddress[addressChoose.value].id_ward
        );
        // setShipChoose(null);
      } else {
        // console.log();
        // setShipChoose(null);
        setProvinceChoose(null);
        setDistrictChoose(null);
        setWardChoose(null);
        setDataDistrict([]);
        setDataWard([]);
        setOptionShip([]);
        setShipChoose(null);
      }
    }
  }, [addressChoose]);

  const [optionShip, setOptionShip] = useState([]);
  const [load2, setLoad2] = useState(false);
  const [shipChoose, setShipChoose] = useState(null);
  useEffect(() => {
    if (infoShip) {
      setOptionShip([]);
      setShipChoose(null);
      for (let i = 0; i < infoShip.length; i++) {
        const temp = createOption(infoShip[i].desc, i);
        if (i == 0) setShipChoose(temp);
        setOptionShip((oldData) => [...oldData, temp]);
      }
    }
    if (optionShip) setLoad2(true);
  }, [infoShip]);

  const createOption = (fullInfo, index) => ({
    label: fullInfo,
    value: index,
  });
  const [optionAddress, setOptionAddress] = useState([]);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    if (listAddress) {
      for (let i = 0; i <= listAddress.length; i++) {
        if (i < listAddress.length) {
          const temp = createOption(listAddress[i]["fullInfo"], i);
          if (listAddress[i]["is_default"] === 1) setAddressChoose(temp);
          setOptionAddress((oldData) => [...oldData, temp]);
        } else {
          const temp = createOption("Create new", -1);
          setOptionAddress((oldData) => [...oldData, temp]);
        }
      }
      if (optionAddress) setLoad(true);
    }
  }, [listAddress]);

  return (
    <>
      {load === true && (
        <>
          {error === "" ? (
            <>
              <Typography variant="h6" gutterBottom>
                Shipping address
              </Typography>
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit((data) => {
                    if (addressChoose.value === -1) {
                      newAddress.fullInfo = `${data.housenumber}, ${wardChoose.label}, ${districtChoose.label}, ${provinceChoose.label}`;
                    }
                    test(
                      data,
                      addressChoose.value === -1
                        ? newAddress
                        : listAddress[addressChoose.value],
                      infoShip[shipChoose.value],
                      addressChoose.value === -1 ? true : false
                    );
                  })}
                >
                  <Grid container spacing={1} style={{ margin: "0px" }}>
                    <p style={{ fontWeight: "500" }}>Address</p>
                    <SelectInput
                      width="552px"
                      required
                      name="address"
                      label="Address line"
                      onChange={(value) => {
                        // console.log("change");
                        setAddressChoose(value);
                      }}
                      value={addressChoose}
                      options={optionAddress}
                    />
                    {addressChoose.value === -1 && (
                      <>
                        <>
                          <SelectInput
                            width="184px"
                            label="Province"
                            value={provinceChoose}
                            onChange={setProvinceChoose}
                            options={dataProvinces}
                          />
                          <SelectInput
                            width="184px"
                            label="District"
                            value={districtChoose}
                            onChange={setDistrictChoose}
                            options={dataDistrict}
                          />
                          <SelectInput
                            width="184px"
                            label="Ward"
                            value={wardChoose}
                            onChange={setWardChoose}
                            options={dataWard}
                          />
                        </>

                        <FormInput
                          required
                          name="housenumber"
                          label="House number and street"
                          type="text"
                        />
                      </>
                    )}
                    <p style={{ fontWeight: "500" }}>Ship</p>
                    <SelectInput
                      required
                      name="ship"
                      label="Ship method"
                      options={optionShip}
                      value={shipChoose}
                      onChange={setShipChoose}
                      width="552px"
                    />
                    <FormInput name="noted" label="Noted" />
                  </Grid>
                  <br />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button component={Link} variant="outlined" to="/cart">
                      Back to Cart
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                      Next
                    </Button>
                  </div>
                </form>
              </FormProvider>
            </>
          ) : (
            <>
              <Typography variant="h5">Error: {error}</Typography>
              <br />
              <Button component={Link} variant="outlined" type="button" to="/">
                Back to home
              </Button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default AddressForm;
