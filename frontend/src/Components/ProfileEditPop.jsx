import React from 'react';
import { TransitionUp } from "../styles";
import {Dialog, DialogTitle, Avatar, Grid, Box, Button, TextField, IconButton} from "@mui/material";

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
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '30px' }}>
            <Box fullWidth  display="flex" flexDirection='column' alignItems="center" justifyContent='center'>
            <label htmlFor="contained-button-file">
                <IconButton component='span'>
                <Avatar alt={currentProfile.name} src={currImage} sx={{ width: 150, height: 150 }}/>
                </IconButton>
            </label>
            <input accept="image/*" id="contained-button-file" hidden multiple type="file" onChange={updateImage}/>
            </Box>
            <Grid item xs={12}>
                <TextField
                    label="name"
                    variant="filled"
                    defaultValue={currentProfile.name}
                    fullWidth
                    onChange={(e) => {
                        currentProfile.name = e.target.value
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Email"
                    variant="filled"
                    defaultValue={currentProfile.email}
                    fullWidth
                    onChange={(e) => {
                        currentProfile.email = e.target.value
                    }}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Gender"
                    variant="filled"
                    defaultValue={currentProfile.gender}
                    fullWidth
                    onChange={(e) => {
                        currentProfile.gender = e.target.value
                    }}
                />
            </Grid>
            
            <Grid item xs={12}>
                <Button fullWidth  variant="contained" onClick={editProfile}>Edit</Button>
            </Grid>
        </Grid>    
            
        </Dialog>
    );
}

export default ProfileEditPop;