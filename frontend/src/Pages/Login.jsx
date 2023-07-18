import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate} from "react-router-dom";
import {Button, Card, CardContent, Grid, Link, TextField} from "@mui/material";
import { ReactComponent as Logo } from '../Resource/logo.svg';
import { styles } from '../styles.js';
function Login(){
    const { getter, setter } = useContext(Context);
    const navigate = useNavigate();
    const submit = (form) => {
        form.preventDefault()
        console.log(form.target.email.value);
        console.log(form.target.password.value);

    }
    return(
        <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh'}}>
            <Grid item xs={3} sx={styles.sameColor}>
                <Card variant="outlined" sx={{ maxWidth: 345 ,backgroundColor: 'rgb(255, 243, 209)'}} >
                    <CardContent>
                        <Grid container justifyContent="center">
                            <Logo style={{ width: '200px', height: '200px' }}/>
                        </Grid>
                        <form onSubmit={submit}>
                            <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                                <Grid item>
                                    <TextField id="email" label="Email" variant="outlined" type="Email" name='email'
                                               sx={styles.sameWidth} required/>
                                </Grid>
                                <Grid item>
                                    <TextField id="password" label="Password" variant="outlined" type="Password" name="password"
                                               sx={styles.sameWidth} required/>
                                </Grid>
                                <Grid item>
                                    <Button type="submit" variant="contained" sx={styles.sameWidth}>Sign in</Button>
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
    )
}

export default Login;