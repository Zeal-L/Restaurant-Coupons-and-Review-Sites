import {Context, useContext} from "../context";
import {Alert, Snackbar} from "@mui/material";
import {styles} from "../styles.js";
import React from "react";

export function Notification() {
  const {getter, setter} = useContext(Context);

  return (
    <Snackbar
      anchorOrigin={{vertical: "bottom", horizontal: "right"}}
      open={getter.notificationPopOpen}
      autoHideDuration={2000}
      onClick={() => {
        setter.setNotificationPopOpen(false);
      }}
      onClose={() => {
        setter.setNotificationPopOpen(false);
      }}
    >
      <Alert severity={getter.notificationType} sx={styles.sameWidth}>{getter.notificationPopMessage}</Alert>
    </Snackbar>
  );
}
