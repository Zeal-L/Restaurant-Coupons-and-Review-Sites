import React, {useEffect} from "react";
import {Context, NotificationType, useContext} from "../context.js";
import {useNavigate} from "react-router-dom";
import {Button, Card, CardContent, Grid, Link, TextField} from "@mui/material";
import {ReactComponent as Logo} from "../Resource/logo.svg";
import {styles} from "../styles.js";
import {LoadingButton} from "@mui/lab";
import {CallApi} from "../CallApi";

export function EMailVerification() {
  const {getter, setter} = useContext(Context);
  const navigate = useNavigate();
  const [codeSent, setCodeSent] = React.useState(false);
  const [sended, setSended] = React.useState(false);
  const [countdown, setCountdown] = React.useState(60);
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const sendCode = (form) => {
    setCodeSent(true);
    setSended(true);
    console.log(form.target.email.value);
    setLoading(true);
    form.preventDefault();
    console.log(form.target.email.value);
    const email = form.target.email.value;
    CallApi("/users/reset/password/send_reset_code/" + form.target.email.value, "PUT").then((res) => {
      if (res.status === 200) {
        setter.showNotification("Code sent.", NotificationType.Success);
      } else {
        setter.showNotification("Code sent failed.", NotificationType.Error);
      }
        setLoading(false);
    });
  };
  const submit = (form) => {
    setLoading(true);
    form.preventDefault();
    console.log(form.target);
    const new_password = form.target.password.value;
    const reset_code = form.target.code.value;
    CallApi("/users/reset/password/verify_reset_code", "PUT", {email, new_password, reset_code}).then((res) => {
        setLoading(false);
        if (res.status === 200) {
            setter.showNotification("Password reset success.", NotificationType.Success);
            navigate("/login");
        } else {
            setter.showNotification(res.body, NotificationType.Error);
        }
    })

  };


  React.useEffect(() => {
    if (codeSent) {
      const timer = countdown > 0 && setInterval(() => setCountdown(countdown - 1), 1000);
      if (countdown === 0) {
        setCodeSent(false);
        setCountdown(5);
      }
      return () => clearInterval(timer);
    }
  }, [codeSent, countdown]);
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: "100vh"}}>
      <Grid item xs={3} sx={styles.sameColor}>
        <Card variant="outlined" sx={{maxWidth: 345, backgroundColor: "rgb(255, 243, 209)"}}>
          <CardContent>
            <Grid container justifyContent="center">
              <Logo style={{width: "200px", height: "200px"}}/>
            </Grid>

            <form onSubmit={sendCode}>

              <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item>
                  <TextField id="email" label="Email" variant="outlined" type="Email" name="email"
                    disabled={codeSent}
                   value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={styles.sameWidth}
                             required/>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="text"
                    disabled={codeSent}
                    sx={styles.sameWidth}>
                    {codeSent ? `Resend Code (${countdown})` : "Send Code"}
                  </Button>
                </Grid>
              </Grid>
            </form>
            <form onSubmit={submit}>
              <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                <Grid item>
                  <TextField id="code" label="Code" variant="outlined" type="text" name="code"
                    disabled={!sended}
                    sx={styles.sameWidth} required/>
                </Grid>

                <Grid item>
                  <TextField id="password" label="New Password" variant="outlined" type="password" name="password"
                             disabled={!sended}
                             sx={styles.sameWidth} required/>
                </Grid>

                <Grid item>
                  <LoadingButton loading={loading} type="submit"  variant="contained" sx={styles.sameWidth}>Submit</LoadingButton>
                </Grid>
                <Grid item>
                  <Link href="/Register">
                    Do not have an account? Sign up here!
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/login">
                    Remember password? Sign in here!
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

export function ResetPassword() {
  useEffect(() => {
    document.title = 'Reset Password';
  }, []);
  const {getter, setter} = useContext(Context);
  const navigate = useNavigate();
  const submit = (form) => {
    form.preventDefault();
    console.log(form.target.email.value);
    console.log(form.target.password.value);
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
                  <TextField id="password" label="Password" variant="outlined" type="Password" name="password"
                    sx={styles.sameWidth} required/>
                </Grid>
                <Grid item>
                  <TextField id="ConfirmPassword" label="Confirm Password" variant="outlined" type="Password"
                    name="Confirm Password"
                    sx={styles.sameWidth} required/>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" sx={styles.sameWidth}>Submit</Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}