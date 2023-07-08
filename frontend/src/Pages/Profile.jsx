import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate} from "react-router-dom";
import {Avatar, Button, Card, CardContent, Grid, Link, TextField, CardMedia, Typography} from "@mui/material";
import { ReactComponent as Logo } from '../Resource/logo.svg';
import { styles } from '../styles.js';
import ProfileEditPop from '../Components/ProfileEditPop.jsx';
function Profile() {
    const [editPopOpen, setEditPopopen] = React.useState(false);
    const [profileInfo, setProfileInfo] = React.useState({
        id: "1",
        name: "TestUser",
        avatar: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
        email: 'test@test.com',
        gender: 'male',
        password: '111'
    })
    return (
        <>
            <div style={{ height: '64px' }}></div>
            {/* <a>展示用户信息，用户名，用户图片，性别，邮箱，都可以更改，密码不显示，但是也可以更改</a> */}
            <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '80vh'}}>
                <Card variant="outlined" sx={{ width:'80%',  maxWidth: 800 ,backgroundColor: 'rgb(255, 243, 209)'}} >
                    <CardContent>
                        <Grid container justifyContent="center" >
                        <Avatar 
                            alt={profileInfo.name}
                            src={profileInfo.avatar}
                            sx={{ width: 100, height: 100 }}/>
                        </Grid>
                        <div style={{ height: '20px' }}></div>
                        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2}>
                            <Grid item sx={{width: '30%'}}>
                                <Typography variant="h7" fontFamily="Helvetica" fontWeight="400">
                                    Name: {profileInfo.name}
                                </Typography>
                            </Grid>
                            <Grid item sx={{width: '30%'}}>
                                <Typography variant="h7" fontFamily="Helvetica" fontWeight="400">
                                    Email: {profileInfo.email}
                                </Typography>
                            </Grid>
                            <Grid item sx={{width: '30%'}}>
                                <Typography variant="h7" fontFamily="Helvetica" fontWeight="400">
                                    Gender: {profileInfo.gender}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Button type="button" variant="contained" sx={styles.sameWidth} onClick={() => {setEditPopopen(true)}}>Edit</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
        </Grid>
        {editPopOpen && <ProfileEditPop open={editPopOpen} profileInfo={profileInfo} setOpen={setEditPopopen} setProfileInfo={setProfileInfo} />}
        </>
    )
}

export default Profile;