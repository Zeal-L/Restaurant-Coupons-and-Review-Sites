import React from "react";
import {Context, NotificationType, useContext} from "../context.js";
import {useNavigate} from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import {Button, Card, CardContent, Grid, Link, TextField} from "@mui/material";
import {ReactComponent as Logo} from "../Resource/logo.svg";
import {styles} from "../styles.js";
import {CallApi} from "../CallApi";
import {LoadingButton} from "@mui/lab";

function Register() {
  // eslint-disable-next-line no-unused-vars
  const {setter, getter} = useContext(Context);
  // console.log(getter);
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();

  const [nameErr, setNameErr] = React.useState(false);
  const [emailErr, setEmailErr] = React.useState(false);
  const [passwordErr, setPasswordErr] = React.useState(false);
  const [confirmPasswordErr, setConfirmPasswordErr] = React.useState(false);
  const [emailVerified, setEmailVerified] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [verificationErr, setVerificationErr] = React.useState(false);

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = React.useState(false);
  const submit = (form) => {
    // form.preventDefault();

    setLoading(true);
    if (emailVerified) {
      codeSubmit(form);
    } else {
      registerSubmit(form);
    }
  };
  const registerSubmit = (form) => {
    form.preventDefault();
    const name = form.target.name.value;
    const email = form.target.email.value;
    const password = form.target.password.value;
    const confirmPassword = form.target.Cpassword.value;
    const isPasswordValid =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password);
    if (!isPasswordValid) {
      setPasswordErr(true);
      setter.showNotification("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.", NotificationType.Error);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordErr(true);
      setter.showNotification("Password and confirm password must be the same.", NotificationType.Error);
      setLoading(false);
      return;
    }
    CallApi("/users/register/send_code", "POST", {name, email, password}).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        setEmailVerified(true);
      } else if (res.status === 400) {
        setEmailErr(true);
        setter.showNotification(res.data.message, NotificationType.Error);
      } else if (res.status === 403) {
        setNameErr(true);
        setter.showNotification(res.data.message, NotificationType.Error);
      } else {
        setter.showNotification("Unknown error: " + res.status, NotificationType.Error);
      }
      setLoading(false);
    });
  };

  const codeSubmit = (form) => {
    form.preventDefault();
    const confirm_code = form.target.code.value;
    const email = form.target.email.value;
    CallApi("/users/register/verify_code", "POST", {email, confirm_code}).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        localStorage.setItem("token", res.data.token);
        setter.setLogin(true);
        navigate("/");
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
      setLoading(false);
    });
  };
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "100vh"}}>
      <Grid item xs={3} sx={styles.sameColor}>
        <Card variant="outlined" sx={{maxWidth: 345, backgroundColor: "rgb(255, 243, 209)"}}>
          <CardContent>
            <Grid container justifyContent="center">
              <Logo style={{width: "200px", height: "200px"}}/>
            </Grid>
            <form onSubmit={submit}>
              <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>

                <Grid item>
                  <TextField id="email" label="Email" variant="outlined" type="Email"
                    name="email"
                    sx={styles.sameWidth}
                    error={emailErr}
                    disabled={emailVerified}
                    required/>
                </Grid>
                {!emailVerified ?
                  <>
                    <Grid item>
                      <TextField id="name" label="Name" variant="outlined" type="text" name="name"
                        sx={styles.sameWidth} error={nameErr} required/>
                    </Grid>
                    <Grid item>
                      <TextField id="password" label="Password" variant="outlined" type="Password"
                        name="password"
                        sx={styles.sameWidth} error={passwordErr} required/>
                    </Grid>
                    <Grid item>
                      <TextField id="Cpassword" label="Confirm Password" variant="outlined"
                        type="Password" name="Cpassword"
                        sx={styles.sameWidth} error={confirmPasswordErr} required/>
                    </Grid>
                  </>
                  :
                  <Grid item>
                    <TextField id="code" label="verification code" variant="outlined" type="text"
                      name="code"
                      sx={styles.sameWidth} error={verificationErr} required/>
                  </Grid>
                }
                <Grid item>
                  <LoadingButton loading={loading} type="submit"  variant="contained" sx={styles.sameWidth}>Sign Up</LoadingButton>
                </Grid>
                <Grid item>
                  <Link href="/login">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Register;