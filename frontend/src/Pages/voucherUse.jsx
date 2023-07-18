import {Box, Button, colors, DialogTitle, Grid, Link, Typography} from "@mui/material";
import {useParams} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import Voucher from "../Components/Voucher";
import dayjs from 'dayjs';

function VoucherUse() {
    const [editPopOpen, setEditPopopen] = React.useState(false);
    const {voucherId} = useParams();
    //const [voucherList, setVoucherList] = React.useState([]);
    const deadline = Date.now() + 60 * 60;
    const [timeLeft, setTimeLeft] = React.useState(deadline - Date.now());

    // let code = "A1E4"
    const [code, setCode] = useState("A1E4");
    const getTime = () => {
        const remainingTime = timeLeft;
        if (remainingTime <= 0) {
            return "Time's up!";
        }
        const day = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hour = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minute = Math.floor((remainingTime / (1000 * 60)) % 60);
        const second = Math.floor((remainingTime / 1000) % 60);
        let char = "";
        if (day > 0) {
            char += `${day}:`;
        }
        if (hour > 0 || char !== "") {
            char += hour.toString().padStart(2, '0') + ":";
        }
        if (minute > 0 || char !== "") {
            char += minute.toString().padStart(2, '0') + ":";
        }
        char += second.toString().padStart(2, '0');
        return char;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(prevTimeLeft => prevTimeLeft - 1000);
        }, 1000);
        if (timeLeft <= 0) {
            setCode("####");
        }
        return () => clearTimeout(timer);
    }, [timeLeft]);

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
    const info =
        {
            id: "1",
            type: "Percentage",
            condition: "Percentage",
            discount: "10% OFF",
            expire: "2023-12-31",
            count: 109,
            description: "this is the description of Percentage voucher.",
            isClaimed: false,
            restaurant: {
                id: "1",
                name: "Restaurant 1",
            },
            autoRelease: {
                range: 102,
                count: 10,
                start: dayjs().format('YYYY-MM-DD'),
                end: dayjs().add(1, 'year').format('YYYY-MM-DD')
            }
        };
    return (
        <>
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
            </Grid>
        {/*    show time as red and 加粗*/}
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '24px' }}>
                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ ...descriptionStyle, fontWeight: 'bold', color: 'red',fontSize: '36px' }}>
                        Time left: {getTime()}
                    </Typography>
                </Grid>
            </Grid>

            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '24px' }}>
                <Grid item xs={12}>
                    <Box sx={{ bgcolor: '#f5f5f5', padding: '24px', borderRadius: '8px', textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                            Voucher Code
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'red' }}>
                            {code}
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#666', mt: 2 }}>
                            Show this code to the staff to claim your voucher.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
            {timeLeft <= 0 && (
                <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '24px' }}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={() => {
                                setCode("A1E4");
                                setTimeLeft(deadline - Date.now());
                            }}
                        >
                            Reacquire
                        </Button>
                    </Grid>
                </Grid>
            )}
        </>

    )


}

export default VoucherUse;