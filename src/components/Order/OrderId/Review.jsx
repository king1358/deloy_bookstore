import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import { formatter } from "../../../lib/formatM";

const ReviewId = ({ listBook, total, shipFee }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        {listBook.map((product) => (
          <ListItem style={{ padding: "10px 0" }} key={product.name}>
            <ListItemText
              primary={product.name}
              secondary={`Quantity: ${product.amount}`}
            />
            <Typography variant="body2">
              {formatter.format(product.total * product.amount)}
            </Typography>
          </ListItem>
        ))}
        <ListItem style={{ padding: "10px 0" }} key="ship">
          <ListItemText primary="Ship fee" />
          <Typography variant="body2">{formatter.format(shipFee)}</Typography>
        </ListItem>
        <ListItem style={{ padding: "10px 0" }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
            {formatter.format(total)}
          </Typography>
        </ListItem>
      </List>
    </>
  );
};
export default ReviewId;
