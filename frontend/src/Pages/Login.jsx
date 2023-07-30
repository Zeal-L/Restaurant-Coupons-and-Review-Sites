import React, {useEffect} from "react";
import {Context, NotificationType, useContext} from "../context.js";
import {useNavigate} from "react-router-dom";
import {Card, CardContent, Grid, Link, TextField} from "@mui/material";
import {ReactComponent as Logo} from "../Resource/logo.svg";
import {styles} from "../styles.js";
import {CallApi} from "../CallApi";
import {LoadingButton} from "@mui/lab";

function Login() {
  useEffect(() => {
    document.title = 'Login';
  }, []);
  // eslint-disable-next-line no-unused-vars
  const {getter, setter} = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const submit = (form) => {
    setLoading(true);
    form.preventDefault();
    const email = form.target.email.value;
    const password = form.target.password.value;
    CallApi("/users/login", "POST", {email, password}).then((res) => {
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        localStorage.setItem("token", res.data.token);
        setter.setLogin(true);
        // navigate("/");
        window.location.href = "/";
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
                  <TextField id="email" label="Email" variant="outlined" type="Email" name="email"
                    sx={styles.sameWidth} required/>
                </Grid>
                <Grid item>
                  <TextField id="password" label="Password" variant="outlined" type="Password" name="password"
                    sx={styles.sameWidth} required/>
                </Grid>
                <Grid item>
                  <LoadingButton loading={loading} type="submit"  variant="contained" sx={styles.sameWidth}>Sign In</LoadingButton>
                </Grid>
                <Grid item>
                  <Link href="/Register">
                    Do not have an account? Sign up here!
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/findPassword/identity">
                    Forgot password?
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

export default Login;