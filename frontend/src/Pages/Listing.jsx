import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Card,
    Grid,
    Box,
    Tooltip,
    CardMedia,
    Container,
    Rating,
} from "@mui/material";
import { FavoriteBorderRounded, PinDrop, Favorite, Restaurant } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import Voucher from '../Components/Voucher.jsx';
import noPicture from '../Resource/image/no-upload-picture.png'
import restaurant1 from '../Resource/image/restaurant1.png';
import restaurant2 from '../Resource/image/restaurant2.png';
import restaurant3 from '../Resource/image/restaurant3.png';
import restaurant4 from '../Resource/image/restaurant4.png';
import restaurant5 from '../Resource/image/restaurant5.png';
import restaurant6 from '../Resource/image/restaurant6.png';
import restaurant7 from '../Resource/image/restaurant7.png';
import { styles } from '../styles.js';
import './index.css';

const defaultRestaurantsList = [
    {
        id: 1,
        name: 'test1', // name
        rate: '4', // rate
        evaluationsNum: 153, // number of review
        address: 'testAddress1111111111111111111111111111111111111111', // address
        image: restaurant1, // image
        favourite: false, // collect
    },
    {
        id: 2,
        name: 'test2', 
        rate: '5',
        evaluationsNum: 34,
        address: 'address2222222222222222222222222',
        image: restaurant2,
        favourite: true
    },
    {
        id: 3,
        name: 'test3',
        rate: '5',
        evaluationsNum: 1123,
        address: 'Sydney',
        image: restaurant3,
        favourite: false,
        vouchersInfo: [
            {
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
            }
        ]
    },
    {
        id: 4,
        name: 'test4',
        rate: '3',
        evaluationsNum: 179,
        address: 'address444...',
        image: restaurant4,
        favourite: false
    },
    {
        id: 5,
        name: 'test5',
        rate: '5',
        evaluationsNum: 8,
        address: 'address......',
        image: restaurant5,
        favourite: false
    },
    {
        id: 6,
        name: 'test6',
        rate: '3',
        evaluationsNum: 99,
        address: 'address......',
        favourite: false
    },
    {
        id: 7,
        name: 'test7',
        rate: '1',
        evaluationsNum: 1,
        address: 'address......',
        image: restaurant7,
        favourite: false
    }
]

function Listing() {
    const [restaurantsList, setRestaurantsList] = useState(defaultRestaurantsList)

    // collect/uncollect
    const collect = ({id, favourite}) => {
        const newList = [...restaurantsList].map(item => {
            if (item.id === id) return {
                ...item,
                favourite: !favourite
            }
            return item
        })
        setRestaurantsList(newList)
    }

    // enter detail page
    const restaurantDetail = (id) => {
        console.log('id:', id)
    }

    return (
        <>
            {/* <div style={{ height: '64px' }}></div>
            <a>展示所有的餐厅，图片，地址，评分，评论数，还有优惠卷，还有一个收藏按钮，点击收藏</a>
            <></> */}
            <Container maxWidth="md" sx={{background: 'rgb(255, 243, 209)'}}>
                <Box sx={styles.sameColor} style={{ height: 'calc(100vh - 64px)', marginTop: '64px', overflow: 'auto' }} >
                    <div style={{ height: 'calc(100% - 5px)', width: '100%', paddingTop: '5px' }}>
                        <div className='list-nav'>
                            <div className='list-nav-icon'>
                                <Restaurant sx={{color: '#ff8400'}} />
                            </div>
                            <h2>美食</h2>
                        </div>
                        {
                            restaurantsList.map((item) => (
                            <Card sx={{ width: '100%', display: 'inline-block', boxShadow: 'none' }}>
                                <Grid container>
                                    <Grid item xs={4} sx={{ height: 200, padding: '10px' }}>
                                        <CardMedia
                                            component="img"
                                            image={item.image}
                                            onClick={() => restaurantDetail(item.id)}
                                            sx={{ cursor: 'pointer', maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                    </Grid>
                                    <Grid item xs={8} className='restaurant-introduction'>
                                        <div style={{display: 'flex', alignItems: 'center'}}>
                                            <div
                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', fontSize: 'x-large' }}
                                                onClick={() => restaurantDetail(item.id)}
                                            >
                                                {item.name}
                                            </div>
                                            {
                                                item.favourite ?
                                                <Favorite
                                                    onClick={() => collect(item)}
                                                    sx={{ width: '0.9rem', marginLeft: '10px', color: pink[500], cursor: 'pointer' }}
                                                /> :
                                                <FavoriteBorderRounded
                                                    onClick={() => collect(item)}
                                                    sx={{ width: '0.9rem', marginLeft: '10px', cursor: 'pointer' }}
                                                />
                                            }
                                        </div>
                                        <div style={{ fontSize: 'x-small', display: 'flex', margin: '8px 0' }}>
                                            <Rating sx={{ fontSize: '1rem', marginRight: '8px' }} name="read-only" value={item.rate} readOnly />
                                            {`${item.evaluationsNum} evaluations`}
                                        </div>
                                        <Tooltip title={item.address} placement="top-start">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <PinDrop sx={{ width: '0.9rem', marginRight: '5px' }}/>
                                                <div style={{ fontSize: 'small', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {item.address}
                                                </div> 
                                            </div>
                                        </Tooltip>
                                        {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}> */}
                                        <div style={{ float: 'left', marginTop: '10px', maxHeight: '60px' }}>
                                        {/* voucher  */}
                                        {
                                            item.vouchersInfo?.length > 0 && item.vouchersInfo.map(voucher => (
                                                <Voucher
                                                    type={voucher.type}
                                                    condition={voucher.condition}
                                                    discount={voucher.discount}
                                                    expire={voucher.expire}
                                                    transform={0.3}
                                                    isListing
                                                    sx={{ marginRight: '10px', display: 'inline-block' }}
                                                />
                                            ))
                                        }
                                        </div>
                                    </Grid>
                                </Grid>
                            </Card>
                            ))
                        }
                    </div>
                </Box>
            </Container>
        </>
    )
}


export default Listing;