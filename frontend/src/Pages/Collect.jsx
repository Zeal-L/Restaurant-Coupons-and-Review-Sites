import React, { useEffect, useState } from 'react';
import {
    Card,
    Grid,
    Box,
    Tooltip,
    CardMedia,
    Rating
} from "@mui/material";
import { PinDrop, Favorite } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import {Context, NotificationType, useContext} from "../context";
import Voucher from '../Components/Voucher.jsx';
import { styles } from '../styles.js';
import './index.css';
import { CallApiWithToken } from '../CallApi.js';

function Collect() {
    const {setter} = useContext(Context);
    useEffect(() => {
        document.title = 'Liked Restaurants'
        CallApiWithToken("/restaurants/get/list/by_favorite", "POST").then((res) => {
            if (res.status === 200) {
                setRestaurantsList(res.data.Restaurants)
            }
        })
    }, []);
    const [restaurantsList, setRestaurantsList] = useState([])
    const [maxWidth, setMaxWidth] = useState(1051)
    const [width, setWidth] = useState()

    const resizeWidth = (e) => {
        const w = e.target.innerWidth
        setWidth(w)
    }

    useEffect(() => {
        const w = window.innerWidth
        setWidth(w)
        window.addEventListener("resize", resizeWidth)
        return () => {
          window.removeEventListener("resize", resizeWidth)
        }
    }, [])

    useEffect(() => {
        if (width >= 1051) {
            setMaxWidth(1051)
        } else if (width < 1051 && width >=716) {
            setMaxWidth(716)
        } else {
            setMaxWidth(360)
        }
    }, [width])

    const collect = (id) => {
        CallApiWithToken(`/users/favorites/remove/${id}`, "DELETE").then((res) => {
            if (res.status === 200) {
                CallApiWithToken("/restaurants/get/list/by_favorite", "POST").then((res) => {
                    if (res.status === 200) {
                        setRestaurantsList(res.data.Restaurants)
                    } else {
                        setRestaurantsList([])
                        setter.showNotification("You haven't collected any restaurants yet", NotificationType.Error);
                    }
                })
            }
          })
    }

    // enter detail page
    const restaurantDetail = (id) => {
        navigate(`/restaurant/${id}`);
    }

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{background: 'rgb(255, 243, 209)', width: `${maxWidth}px`}}>
                <Box sx={styles.sameColor} style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }} >
                    <div style={{ height: 'calc(100% - 5px)', width: '100%', paddingTop: '5px' }}>
                        <div className='list-nav' style={{ margin: '0 10px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='list-nav-icon'>
                                    <Favorite sx={{color: '#ff8400'}} />
                                </div>
                                <h2>Collect</h2>
                            </div>
                        </div>
                        <div>
                        {
                            restaurantsList.map((item) => (
                            <Card sx={{ width: '320px', height: '388px', display: 'inline-block', boxShadow: 'none', margin: '10px' }}>
                                <Grid container>
                                    <Grid item xs={12} sx={{ height: 200, padding: '10px' }}>
                                        <CardMedia
                                            component="img"
                                            image={`data:image/png;base64,${item.image}`}
                                            onClick={() => restaurantDetail(item.restaurant_id)}
                                            sx={{ cursor: 'pointer', maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='restaurant-introduction'>
                                        <div style={{display: 'flex', alignItems: 'end'}}>
                                            <div
                                                style={{ overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', fontSize: 'x-large' }}
                                                onClick={() => restaurantDetail(item.restaurant_id)}
                                            >
                                                {item.name}
                                            </div>
                                            {
                                                <Favorite
                                                    onClick={() => collect(item.restaurant_id)}
                                                    sx={{ width: '1.2em', height: '1.2em', marginLeft: '10px', color: pink[500], cursor: 'pointer' }}
                                                />
                                            }
                                        </div>
                                        <div style={{ fontSize: 'x-small', display: 'flex', margin: '8px 0' }}>
                                            <Rating sx={{ fontSize: '1rem', marginRight: '8px' }} name="read-only" value={item.rating} readOnly />
                                            {`${item.comment_count} evaluations`}
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
                    </div>
                </Box>
            </div>
        </div>
    )
}


export default Collect;