import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Grid } from "@material-ui/core";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

function FormInput({ name, label, required, setData }) {
  const { control } = useFormContext();
  const isError = false;

  return (
    <Grid item xs={20} sm={12}>
      <Controller
        as={TextField}
        name={name}
        control={control}
        label={label}
        fullWidth
        required={required}
        error={isError}
      />
    </Grid>
  );
}

function SelectInput({ width, label, value, onChange, options }) {
  return (
    <div style={{ width: width, marginBottom: "7px" }}>
      <Select
        value={value}
        onChange={(changeValue) => {
          onChange(changeValue);
        }}
        options={options}
        required={true}
        placeholder={`Select ${label}`}
        isClearable
      />
    </div>
  );
}

function CreatableSelectInput({
  width,
  label,
  value,
  onChange,
  options,
  isLoading,
}) {
  // const handleCreate = (inputValue) => {
  //   setIsLoading(true);
  //   setTimeout(() => {
  //     const newOption = createOption(inputValue);
  //     setIsLoading(false);
  //     setOptions2((prev) => [...prev, newOption]);
  //     setSelectedOption2(newOption);
  //   }, 1000);
  // };
  // const createOption = (label) => ({
  //   label,
  //   value: options2.length + 1,
  // });
  return (
    <div style={{ width: width }}>
      <p>{label}</p>
      <CreatableSelect
        value={value}
        // onChange={(data) => {
        //   console.log(data);
        //   setSelectedOption2(data);
        //   setData(data != null ? data.value : null);
        // }}
        isLoading={isLoading}
        isClearable
        // onCreateOption={handleCreate}
        isDisabled={isLoading}
        options={options}
        required={true}
        placeholder="Select or choose new address"
      />
    </div>
  );
}

export { FormInput, SelectInput, CreatableSelectInput };
