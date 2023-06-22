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
function Voucher(props) {
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
    const pad = 24*transform
    return (
        <Grid container spacing={2} sx={{
            width: `${width}px`,
            height: `${height}px`,
            padding: `0`,
            backgroundImage: `url(${url})`,
            backgroundSize: 'contain',
            transform: `scale(${transform})`
        }}>
            {/*<Box sx={{ transform: `scale(${transform})` }}>*/}
                <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                    <Typography variant="subtitle1" color="white" sx={{ textAlign: 'center' }}>
                        {condition}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                    <Typography variant="h3" component="h1" color="white" textAlign="center" sx={{ textAlign: 'center', fontWeight: 600  }}>
                        {discount}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ alignSelf: 'center' }}>
                    <Typography variant="body1" color="white" sx={{ textAlign: 'center' }}>
                        {expire}
                    </Typography>
                </Grid>
            {/*</Box>*/}
        </Grid>
);
}

Voucher.protoType = {
    type: PropTypes.string.isRequired,
    condition: PropTypes.string.isRequired,
    discount: PropTypes.string.isRequired,
    expire: PropTypes.string.isRequired,
    transform: PropTypes.string,
}


export default Voucher;
