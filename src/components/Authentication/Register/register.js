import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormInput, SelectInput } from "./CustomTextField";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
  CssBaseline,
  Paper,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import useStyles from "./style";
import { useQuery } from "react-query";

export default function Register() {
  const { register, errors, handleSubmit, watch, control } = useForm({
    mode: "onBlur",
  });
  const linkTo = useNavigate();
  const classes = useStyles();

  //   const cookies = new Cookies();
  const toastId = useRef(null);
  let pwd = watch("password");
  const [dataProvinces, setDataProvinces] = useState([{}]);
  const [dataDistrict, setDataDistrict] = useState([{}]);
  const [dataWard, setDataWard] = useState([{}]);
  const [provinceChoose, setProvinceChoose] = useState(null);
  const [districtChoose, setDistrictChoose] = useState(null);
  const [wardChoose, setWardChoose] = useState(null);
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
  useEffect(() => {
    getProvince();
    // console.log("test1");
  }, []);
  useEffect(() => {
    if (provinceChoose) {
      // console.log("test2");
      // console.log(provinceChoose);
      setDistrictChoose(null);
      setWardChoose(null);
      getDistrict(provinceChoose.value);
    } else {
      setDistrictChoose(null);
      setWardChoose(null);
    }
  }, [provinceChoose]);
  useEffect(() => {
    if (districtChoose) {
      setWardChoose(null);
      getWard(districtChoose.value);
    } else {
      setWardChoose(null);
    }
  }, [districtChoose]);
  const [load1, setLoad1] = useState(false);
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
      setLoad1(true);
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
      setLoad1(true);
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
      setLoad1(true);
      //console.log(dataWard);
    }
  }, [dataWard]);
  const [errorUsername, setErrorUserName] = useState(false);

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    // console.log(formData.keys);
    // console.log(formData.values);
    toastId.current = toast("Processing", {
      theme: "dark",
      type: "info",
      autoClose: 3000,
      hideProgressBar: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    axios
      .post(process.env.REACT_APP_API + "/User/register", formData)
      .then((res) => {
        toast.update(toastId.current, {
          render: "Sign up success",
          type: "success",
          theme: "dark",
          hideProgressBar: false,
          autoClose: 1500,
        });
        setErrorUserName(false);
        linkTo("/");
      })
      .catch((error) => {
        if (error.response.data.result === "Account exists") {
          setErrorUserName(true);
        }
      });
  };
  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Sign up
          </Typography>

          <form
            onSubmit={handleSubmit((data, e) => {
              // //console.log(data);
              const userData = {
                ...data,
                id_province: provinceChoose.value,
                id_district: districtChoose.value,
                id_ward: wardChoose.value,
              };
              onSubmit(userData, e);
            })}
          >
            <Grid container spacing={1}>
              <FormInput
                required
                name="username"
                label="Username"
                type="text"
                control={control}
              />
              {errorUsername && (
                <p style={{ color: "#bf1650", marginBottom: "0px" }}>
                  ⚠ Account exists
                </p>
              )}
              <FormInput
                required
                name="password"
                label="Password"
                type="password"
                control={control}
              />
              <FormInput
                required
                name="password_repeat"
                label="Confirm password"
                type="password"
                control={control}
                rule={{
                  validate: (value) =>
                    value === pwd || "The passwords do not match",
                }}
              />

              {errors.password_repeat && (
                <p style={{ color: "#bf1650", marginBottom: "0px" }}>
                  {"⚠ "}
                  {errors.password_repeat.message}
                </p>
              )}
              <FormInput
                required
                name="fullname"
                label="Fullname"
                type="text"
                control={control}
                width="156px"
              />
              <FormInput
                required
                name="phone"
                label="Phone number"
                type="text"
                control={control}
                width="135px"
              />
              <FormInput
                required
                name="email"
                label="Email"
                type="email"
                control={control}
              />
              <section style={{ width: "100%" }}>
                <p style={{ marginBottom: "0px", marginTop: "25px" }}>
                  Birth date
                </p>
                <FormInput
                  required
                  name="birthDate"
                  // label="Birth date"
                  type="date"
                  control={control}
                />
                <p style={{ marginBottom: "12px", marginTop: "25px" }}>
                  Address
                </p>
              </section>
              {/* {load1 === true && ( */}
              <>
                <SelectInput
                  label="Province"
                  value={provinceChoose}
                  onChange={setProvinceChoose}
                  options={dataProvinces}
                />
                <SelectInput
                  label="District"
                  value={districtChoose}
                  onChange={setDistrictChoose}
                  options={dataDistrict}
                />
                <SelectInput
                  label="Ward"
                  value={wardChoose}
                  onChange={setWardChoose}
                  options={dataWard}
                />
              </>
              {/* )} */}
              <FormInput
                required
                name="housenumber"
                label="House number and street"
                type="text"
                control={control}
              />
            </Grid>

            <div className="d-grid gap-2 mt-3">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ margin: "0px" }}
              >
                Submit
              </button>
            </div>
          </form>
        </Paper>
      </main>
    </>
  );
}
