import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Grid } from '@mui/material';
import Voucher from "../../Components/Voucher";
function VoucherRest() {
    // const menuItems = [
    //     {
    //         id: "1",
    //         type: "Percentage",
    //         condition: "Spend $50 or more",
    //         discount: "10%",
    //         expire: "2023-12-31"
    //     },
    //     {
    //         name: '菜品二',
    //         price: '$12.99',
    //         image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
    //         description: '这是菜品二的介绍。',
    //     },
    //     {
    //         name: '菜品三',
    //         price: '$8.99',
    //         image: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg',
    //         description: '这是菜品三的介绍。',
    //     },
    // ];

    return (
        <Grid container rowSpacing={2} columnSpacing={2} name="listings"
              alignItems="center" sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            marginTop: 1,
        }}>
            <Grid item>
                <Voucher type="blue"/>
            </Grid>
            <Grid item>
                <Voucher type="yellow"/>
            </Grid>
            <Grid item>
                <Voucher type="green"/>
            </Grid>
            <Grid item>
                <Voucher type="green"/>
            </Grid>
            <Grid item>
                <Voucher type="purple"/>
            </Grid>
            <Grid item>
                <Voucher type="yellow"/>
            </Grid>
            <Grid item>
                <Voucher type="yellow"/>
            </Grid>
            <Grid item>
                <Voucher type="green"/>
            </Grid>
        </Grid>
    );
};

export default VoucherRest;

