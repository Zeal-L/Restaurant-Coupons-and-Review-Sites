import React from "react";
import {TransitionUp} from "../styles";
import {Context, NotificationType, useContext} from "../context.js";
import {Button, Dialog, DialogTitle, Grid, TextField} from "@mui/material";
import { CallApiWithToken } from "../CallApi";

function ChangePasswordPop(props) {
  const {setter} = useContext(Context);
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [Cpassword, setCpassword] = React.useState("");
  const [oldpasswordErr, setOldPasswordErr] = React.useState(false);
  const [passwordErr, setPasswordErr] = React.useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = React.useState(false);

  const currentPassword = props.currentPassword;
  const editProfile = () => {
    const isPasswordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password);
    if (!isPasswordValid) {
      setPasswordErr(true);
      setter.showNotification("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.", NotificationType.Error);
      return;
    }
    if (password !== Cpassword) {
      setConfirmPasswordErr(true);
      setter.showNotification("Password and confirm password must be the same.", NotificationType.Error);
      return;
    }
    const data = {
      "old_password": oldPassword,   
      "new_password": password,
    }
    CallApiWithToken("/users/reset/password/with_old_password", "PUT", data).then((res) => {
      if (res.status === 200) {
        props.setOpen(false);
        localStorage.setItem("token", res.data.token);
        setter.showNotification("success", NotificationType.Success);
      } else {
        setter.showNotification("Unknown error: " + res.data.message, NotificationType.Error);
      }
    });
  };
  return (
    <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: "30px" }}>
        <Grid item xs={12}>
          <TextField
            label="Old Password"
            variant="filled"
            type="password"
            fullWidth
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            error={oldpasswordErr}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="New Password"
            variant="filled"
            fullWidth
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            error={passwordErr}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Confirm Password"
            variant="filled"
            fullWidth
            type="password"
            onChange={(e) => {
              setCpassword(e.target.value);
            }}
            error={confirmPasswordErr}
          />
        </Grid>
      </Grid> 
      <Grid item xs={12}>
        <Button fullWidth  variant="contained" onClick={editProfile}>Edit</Button>
      </Grid>
    </Dialog>
  );
}

export default ChangePasswordPop;