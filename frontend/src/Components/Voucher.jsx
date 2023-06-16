import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
// import { ReactComponent as VoucherIcon } from '../voucher.svg';
import {green} from "@mui/material/colors";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";

import blueVoucher from '../Resource/voucher/blue.png';
import greenVoucher from '../Resource/voucher/green.png';
import purpleVoucher from '../Resource/voucher/purple.png';
import yellowVoucher from '../Resource/voucher/yellow.png';
import PropTypes from "prop-types";

function Voucher(props) {
    const { type, condition, discount, expire } = props;
    let url = '';
    if (type === 'blue') {
        url = blueVoucher;
    } else if (type === 'green') {
        url = greenVoucher;
    } else if (type === 'purple') {
        url = purpleVoucher;
    } else if (type === 'yellow') {
        url = yellowVoucher;
    }
    return (
        <Grid container spacing={2} sx={{
            width: '366px',
            height: '196px',
            padding: '24px',
            backgroundImage: `url(${url})`,
            backgroundSize: 'contain',
        }}>
            <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                <Typography variant="subtitle1" color="white" sx={{ textAlign: 'center' }}>
                    No Condition
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                <Typography variant="h3" component="h1" color="white" textAlign="center" sx={{ textAlign: 'center', fontWeight: 600  }}>
                    50$ OFF
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                <Typography variant="body1" color="white" sx={{ textAlign: 'center' }}>
                    Exp: 1/2/2021
                </Typography>
            </Grid>
        </Grid>
);
}

Voucher.prototype = {
    type: PropTypes.string.isRequired
}


export default Voucher;
