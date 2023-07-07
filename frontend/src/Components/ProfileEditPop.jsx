import React from 'react';
import { TransitionUp } from "../styles";
import {Dialog, DialogTitle, Avatar, Grid, Link, Typography, Chip, Box, colors, Button, TextField} from "@mui/material";
import dayjs from 'dayjs';

function ProfileEditPop(props) {
    const currentProfile = props.profileInfo;
    const [currImage, setCurrImage] = React.useState(currentProfile.avatar);
    const editProfile = () => {
        props.setProfileInfo(currentProfile);
        props.setOpen(false);
    }
    const updateImage = (e) => {
        if (e.target.files[0]) {
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onloadend = () => {
                currentProfile.avatar = reader.result;
                setCurrImage(reader.result);
            };
        }
    }
    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
            <DialogTitle>Edit Profile Information</DialogTitle>
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '50px' }}>
            <Box fullWidth  display="flex" flexDirection='column' alignItems="center" justifyContent='center'>
                <Avatar 
                            alt={currentProfile.name}
                            src={currImage}
                            sx={{ width: 100, height: 100 }}/>
                <input accept="image/*" type="file"  onChange={updateImage}/>
            </Box>
            <TextField
                label="name"
                variant="filled"
                defaultValue={currentProfile.name}
                fullWidth
                onChange={(e) => {
                    currentProfile.name = e.target.value
                }}
            />
            <TextField
                label="Email"
                variant="filled"
                defaultValue={currentProfile.email}
                fullWidth
                onChange={(e) => {
                    currentProfile.email = e.target.value
                }}
            />
            <TextField
                label="Gender"
                variant="filled"
                defaultValue={currentProfile.gender}
                fullWidth
                onChange={(e) => {
                    currentProfile.gender = e.target.value
                }}
            />
            <TextField
                label="Password"
                variant="filled"
                fullWidth
                onChange={(e) => {
                    currentProfile.password = e.target.value
                }}
            />
            
            <Grid item xs={12}>
                <Button fullWidth  variant="contained" onClick={editProfile}>Edit</Button>
            </Grid>
        </Grid>    
            
        </Dialog>
    );
}

export default ProfileEditPop;