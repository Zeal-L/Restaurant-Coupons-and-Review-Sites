import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
// import { ReactComponent as VoucherIcon } from '../voucher.svg';
import {green} from "@mui/material/colors";
import React from "react";
import Grid from "@mui/material/Unstable_Grid2";


import blueVoucher from '../Resource/voucher/blue.png';
import greenVoucher from '../Resource/voucher/green.png';
import purpleVoucher from '../Resource/voucher/purple.png';
import yellowVoucher from '../Resource/voucher/yellow.png';
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
function Voucher_m(props) {
    const { type, condition, discount, expire } = props;
    let url = '';
    if (type === 'Fixed Amount') {
        url = blueVoucher;
    } else if (type === 'Percentage') {
        url = greenVoucher;
    } else if (type === 'Free') {
        url = purpleVoucher;
    } else if (type === 'CFree') {
        url = yellowVoucher;
    }
    const transform = props.transform ? props.transform : '1';
    const width = 366 * transform;
    const height = 196 * transform;
    return (
        <Grid container spacing={2} sx={{
            width: `${width}px`,
            height: `${height}px`,
            padding: '24px',
            backgroundImage: `url(${url})`,
            backgroundSize: 'contain',
        }}>
            <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                <Typography variant="subtitle1" color="white" sx={{ textAlign: 'center' }}>
                    {condition}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                <Typography variant="h3" component="h1" color="white" sx={{ textAlign: 'center', fontWeight: 600 }}>
                    {discount}
                </Typography>
            </Grid>
            <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                <Typography variant="body1" color="white" sx={{ textAlign: 'center' }}>
                    {expire}
                </Typography>
            </Grid>
        </Grid>
);
}

Voucher_m.protoType = {
    type: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    discount: PropTypes.string.isRequired,
    expire: PropTypes.string.isRequired,
    transform: PropTypes.string
}


export default Voucher_m;
