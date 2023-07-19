import React from 'react';
import {Context, useContext} from '../context.js';
import {useNavigate} from "react-router-dom";
import {TransitionUp} from "../styles";
import {Button, Chip, colors, Dialog, DialogTitle, Grid, Link, Typography} from "@mui/material";
import Voucher from "./Voucher";
import TransforPop from './TransferPop.jsx';

function VoucherInfoPop(props) {
    const {getter, setter} = useContext(Context);
    const [transferOpen, setTransferOpen] = React.useState(false);
    const navigate = useNavigate();
    const isRestaurant = props.isRestaurant;
    const used = false ? props.used === undefined : props.used;
    console.log(used);
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
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{padding: '24px'}}>
                <Grid item alignItems="center">
                    <Voucher
                        type={info.type}
                        condition={info.condition}
                        discount={info.discount}
                        expire={info.expire}
                        pop={false}
                    />
                </Grid>
                {isRestaurant &&
                    <Grid item>
                        <Chip label={`Total ${info.total} vouchers, ${info.count} left.`}/>
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
                        This voucher expires on {info.expire}.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" style={{color: colors.grey[500]}}>
                        *{info.description}
                    </Typography>
                </Grid>
                {!used &&
                    <>
                        {isRestaurant ?
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" fullWidth>
                                    Get this voucher
                                </Button>
                            </Grid>
                            :
                            <>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={() => {
                                        navigate('/user/voucher/' + info.id);
                                    }} fullWidth>
                                        Use this voucher
                                    </Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" onClick={() => {
                                        setTransferOpen(true);
                                        console.log(transferOpen)
                                    }} fullWidth>
                                        Transfer this voucher
                                    </Button>
                                </Grid>
                            </>
                        }
                    </>
                }
                <Grid item xs={12}>
                    <Button variant="text" color="primary" fullWidth onClick={() => props.setOpen(false)}>
                        Cancel
                    </Button>
                </Grid>
            </Grid>
            {transferOpen === true && <TransforPop open={transferOpen} setOpen={setTransferOpen} id={props.id}/>}
        </Dialog>
    );
}

export default VoucherInfoPop;
