import React from 'react';
import { Context, useContext } from '../context.js';
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    BottomNavigation,
    BottomNavigationAction,
    ButtonGroup,
    Link,
    Rating,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Unstable_Grid2';
import Button from "@mui/material/Button";
import Menu from "./RestaurantPages/Menu";
import VoucherRest from "./RestaurantPages/VoucherRest";
import Review from "./RestaurantPages/Review";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LabelIcon from '@mui/icons-material/Label';
import ReviewsIcon from '@mui/icons-material/Reviews';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { CSSTransition } from 'react-transition-group';
function Restaurant() {
    const { restaurantId } = useParams();
    const [alignment, setAlignment] = React.useState('Menu');

    const handleAlignment = (event, newAlignment) => {
        console.log(newAlignment);
        if (newAlignment !== null){
            setAlignment(newAlignment);
        }
    };
    return (
        <>
            <Box
                component="div"
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '300px',
                    overflow: 'hidden',
                }}
            >
                <Box
                    component="img"
                    src="https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg"
                    alt="Restaurant Image"
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover', filter: 'blur(6px)' }}
                />
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        width: '80%',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.8)',
                    }}
                >
                    <Grid item>
                        <Typography variant="h2" fontFamily="Helvetica" fontWeight="400">
                            KFC
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Rating name="customized-10" value={4.7} max={5} style={{ margin: '10px 0' }} readOnly />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" fontFamily="Helvetica" fontWeight="400">
                            4.7 (200+ Reviews)
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            marginTop="16px"
                        >
                            <LocationOnIcon sx={{ marginRight: '8px' }} />
                            <Link
                                href="https://www.google.com/maps/place/40-50+Arncliffe+Street,+Wolli+Creek"
                                target="_blank"
                                rel="noopener"
                                color="inherit"
                            >
                                40-50 Arncliffe Street, Wolli Creek 新南威尔士州
                            </Link>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <BottomNavigation
                key="BottomNavigation"
                showLabels
                value={alignment}
                onChange={handleAlignment}
            >
                <BottomNavigationAction value="Menu" label="Menu" icon={<RestaurantMenuIcon />} />
                <BottomNavigationAction value="VoucherRest" label="Voucher" icon={<ConfirmationNumberIcon />} />
                <BottomNavigationAction value="Review" label="Review" icon={<ReviewsIcon />} />
            </BottomNavigation>
            {
                alignment === 'Menu' ?
                    <Menu/>
                : alignment === 'VoucherRest' ?
                    <VoucherRest/>
                :
                    <Review/>
            }

        </>
    )
}

export default Restaurant;