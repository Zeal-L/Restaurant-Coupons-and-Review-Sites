import React from "react";
import {TransitionUp} from "../styles";
import {Context, NotificationType, useContext} from "../context.js";
import {Button, Dialog, DialogTitle, Grid, TextField} from "@mui/material";

function ChangePasswordPop(props) {
  const {setter, getter} = useContext(Context);
  const [oldPassword, setOldPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [Cpassword, setCpassword] = React.useState("");
  const [oldpasswordErr, setOldPasswordErr] = React.useState(false);
  const [passwordErr, setPasswordErr] = React.useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = React.useState(false);

  const currentProfile = props.profileInfo;
  const editProfile = () => {
    if (oldPassword !== currentProfile.password) {
      setOldPasswordErr(true);
      setter.showNotification("Please enter old password right.", NotificationType.Error);
      return;
    }
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
    currentProfile.password = password;
    props.setProfileInfo(currentProfile);
    props.setOpen(false);
  };
  return (
    <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>Change Password</DialogTitle>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{padding: "30px"}}>
        <Grid item xs={12}>
          <TextField
            label="Old Password"
            variant="filled"
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
            onChange={(e) => {
              setCpassword(e.target.value);
            }}
            error={confirmPasswordErr}
          />
        </Grid>
      </Grid>


      <Grid item xs={12}>
        <Button fullWidth variant="contained" onClick={editProfile}>Edit</Button>


      </Grid>


    </Dialog>
  );
}

export default ChangePasswordPop;