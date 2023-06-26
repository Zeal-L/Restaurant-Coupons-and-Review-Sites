import React from 'react';
import { Context, useContext } from '../context.js';
import { useNavigate } from "react-router-dom";
import { TransitionUp } from "../styles";
import {Dialog, DialogTitle, Grid, Link, Typography, Chip, Box, colors, Button} from "@mui/material";
import Voucher from "./Voucher";
import dayjs from 'dayjs';

function VoucherInfoPop(props) {
    const { getter, setter } = useContext(Context);
    const navigate = useNavigate();
    const [isGet, setIsGet] = React.useState(false);
    const info = {
        id: "1",
        type: "Percentage",
        condition: "Spending over $100",
        discount: "10% OFF",
        expire: "2023-12-31",
        count: 109,
        total: 1000,
        description: "This is the description of the Percentage voucher.",
        restaurant: {
            id: "1",
            name: "Restaurant 1",
        }
    };

    const descriptionStyle = {
        marginBottom: '16px',
        textAlign: 'center',
    };

    const linkStyle = {
        cursor: 'pointer',
        color: '#1976D2',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
    };

    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
            <DialogTitle>Voucher Information</DialogTitle>
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '24px' }}>
                <Grid item alignItems="center">
                    <Voucher
                        type={info.type}
                        condition={info.condition}
                        discount={info.discount}
                        expire={info.expire}
                        pop={false}
                    />
                </Grid>
                {isGet &&
                    <Grid item>
                        <Chip label={`Total ${info.total} vouchers, ${info.count} left.`} />
                    </Grid>
                }
                <Grid item xs={12}>
                    <Typography variant="body2" style={descriptionStyle}>
                        This voucher is provided by{' '}
                        <Link
                            href={`/restaurant/${info.restaurant.id}`}
                            sx={linkStyle}
                        >
                            {info.restaurant.name}
                        </Link>
                        .
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" style={descriptionStyle}>
                        Discount is applicable only when you meet the following condition: {info.condition}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" style={descriptionStyle}>
                        This voucher will expire on {info.expire}.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" style={{color: colors.grey[500]}}>
                        *{info.description}
                    </Typography>
                </Grid>

                {isGet ?
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth>
                            Get this voucher
                        </Button>
                    </Grid>
                    :
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" fullWidth>
                            Use this voucher
                        </Button>
                    </Grid>
                }
                <Grid item xs={12}>
                    <Button variant="text" color="primary" fullWidth>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default VoucherInfoPop;
