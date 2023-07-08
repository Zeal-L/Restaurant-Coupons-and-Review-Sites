import React from 'react';
import { Context, useContext } from '../context.js';
import { useNavigate } from "react-router-dom";
import { TransitionUp } from "../styles";
import {Dialog, DialogTitle, Grid, Link, Typography, Chip, Box, colors, Button, TextField} from "@mui/material";
import dayjs from 'dayjs';

function TransforPop(props) {
    const [transferTarget , setTansferTarget] = React.useState('');
    const transferVoucher = () => {
        props.setOpen(false);
    }
    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
            <TextField
                label="Email"
                variant="filled"
                fullWidth
                value={transferTarget}
                onChange={(e) => setTansferTarget(e.target.value)}
            />
            <Button variant="contained" onClick={transferVoucher}>Transfer</Button>
        </Dialog>
    );
}

export default TransforPop;