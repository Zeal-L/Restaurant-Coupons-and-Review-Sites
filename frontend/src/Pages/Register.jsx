import React from 'react';
import {Context, NotificationType, useContext} from '../context.js';
import {useNavigate} from "react-router-dom";
import {Button, Card, CardContent, Grid, TextField} from "@mui/material";
import {ReactComponent as Logo} from '../logo.svg';
import {styles} from '../styles.js';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

function Register() {
    const {setter, getter} = useContext(Context);
    console.log(getter)
    const navigate = useNavigate();

    const [nameErr, setNameErr] = React.useState(false);
    const [emailErr, setEmailErr] = React.useState(false);
    const [passwordErr, setPasswordErr] = React.useState(false);
    const [confirmPasswordErr, setConfirmPasswordErr] = React.useState(false);
    const [emailVerified, setEmailVerified] = React.useState(false);
    const [verificationErr, setVerificationErr] = React.useState(false);
    const submit = (form) => {
        form.preventDefault()
        console.log(form.target.name.value);
        console.log(form.target.email.value);
        console.log(form.target.password.value);
        console.log(form.target.Cpassword.value);
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
            return
        }
        if (password !== confirmPassword) {
            setConfirmPasswordErr(true);
            setter.showNotification("Password and confirm password must be the same.", NotificationType.Error);
            return
        }
        //     call register api
        //     if success
        //     doing email verification
        setter.showNotification("Verification code has been sent to your email.", NotificationType.Success);
        setEmailVerified(true);
    }
    return (
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{minHeight: '100vh'}}>
            <Grid item xs={3} sx={styles.sameColor}>
                <Card variant="outlined" sx={{maxWidth: 345, backgroundColor: 'rgb(255, 243, 209)'}}>
                    <CardContent>
                        <Grid container justifyContent="center">
                            <Logo style={{width: '200px', height: '200px'}}/>
                        </Grid>
                        <form onSubmit={submit}>
                            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>

                                <Grid item>
                                    <TextField id="email" label="Email" variant="outlined" type="Email"
                                               name='email'
                                               sx={styles.sameWidth}
                                               error={emailErr}
                                               disabled={emailVerified}
                                               required/>
                                </Grid>
                                {!emailVerified ?
                                    <>
                                        <Grid item>
                                            <TextField id="name" label="Name" variant="outlined" type="text" name='name'
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
                                        <TextField id="code" label="verification code" variant="outlined" type="text" name='code'
                                                   sx={styles.sameWidth} error={verificationErr} required/>
                                    </Grid>
                                }
                                <Grid item>
                                    <Button type="submit" variant="contained" sx={styles.sameWidth}>Sign Up</Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}

export default Register;