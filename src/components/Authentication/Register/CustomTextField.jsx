import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Grid } from "@material-ui/core";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

function FormInput({
  name,
  label,
  required,
  type,
  control,
  rule = null,
  ref = null,
}) {
  const isError = false;
  return (
    <Grid item xs={10} sm={12}>
      <Controller
        as={TextField}
        name={name}
        control={control}
        label={label}
        fullWidth
        required={required}
        error={isError}
        type={type}
        rules={rule}
        ref={ref}
      />
    </Grid>
  );
}

function SelectInput({ width, label, value, onChange, options }) {
  return (
    <div style={{ width: "157px" }}>
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

export { FormInput, SelectInput };
