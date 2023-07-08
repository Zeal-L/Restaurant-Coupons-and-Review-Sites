import React from 'react';
import { Context, useContext } from '../context.js';
import { useNavigate } from "react-router-dom";
import { TransitionUp } from "../styles";
import {Dialog, DialogTitle, Grid, Link, Typography, Chip, Box, colors, Button, TextField} from "@mui/material";
import dayjs from 'dayjs';

function DeletePop(props) {
    const deleteYes = () => {
        props.setOpen(false);
    }
    const deleteNo = () => {
        props.setOpen(false);
    }
    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
            <DialogTitle>Do you want to delete this voucher?</DialogTitle>
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '24px' }}>
                <Grid item xs={6}>
                    <Button variant="contained" fullWidth onClick={deleteYes}>Yes</Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant="contained" fullWidth onClick={deleteNo}>Cancel</Button>
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default DeletePop;