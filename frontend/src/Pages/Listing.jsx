import React, { useEffect, useState } from 'react';
import {
    Card,
    Grid,
    Box,
    Tooltip,
    CardMedia,
    Rating,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    InputBase
} from "@mui/material";
import { styled, alpha } from '@mui/material/styles';
import { FavoriteBorderRounded, PinDrop, Favorite, Restaurant, Search as SearchIcon, Sort  } from '@mui/icons-material';
import { pink } from '@mui/material/colors';
import Voucher from '../Components/Voucher.jsx';
import restaurant1 from '../Resource/image/restaurant1.png';
import restaurant2 from '../Resource/image/restaurant2.png';
import restaurant3 from '../Resource/image/restaurant3.png';
import restaurant4 from '../Resource/image/restaurant4.png';
import restaurant5 from '../Resource/image/restaurant5.png';
import restaurant6 from '../Resource/image/restaurant6.png';
import restaurant7 from '../Resource/image/restaurant7.png';
import { styles } from '../styles.js';
import './index.css';
import {useNavigate} from "react-router-dom";

const defaultRestaurantsList = [
    {
        id: 1,
        name: 'test1',
        rate: '4',
        evaluationsNum: 153,
        address: 'testAddress1111111111111111111111111111111111111111',
        image: restaurant1,
        favourite: false,
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
        rate: '3',
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
        image: restaurant6,
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

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      }
    },
  }));

function Listing() {
    const [restaurantsList, setRestaurantsList] = useState(defaultRestaurantsList)
    const [maxWidth, setMaxWidth] = useState(1051)
    const [width, setWidth] = useState()

    const [sortValue, setSortValue] = React.useState('default');
    const navigate = useNavigate();
    const handleSort = (event, data) => {
        setSortValue(data)
        if (data === 'default') return setRestaurantsList([...defaultRestaurantsList])
        const newRestaurantsList = [...restaurantsList].sort((a, b) => {
            if (data === 'rate') {
                return parseFloat(b.rate) - parseFloat(a.rate)
            } else if (data === 'count') {
                return b.evaluationsNum - a.evaluationsNum
            }
        })
        setRestaurantsList(newRestaurantsList)
    };

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

    // collect/delete collect
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
        navigate(`/restaurant/${id}`)
    }

    const debounceFilter = (func, wait) => {
        let timeout;
        return function () {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            func(arguments);
          }, wait);
        };
      };

    // filter
    const handleChange = debounceFilter((data) => {
        if (data[0]) {
            const newRestaurantsList = [...defaultRestaurantsList].filter((i) => i.name.includes(data[0])).filter(i => i)
            setRestaurantsList(newRestaurantsList)
        } else {
            setRestaurantsList([...defaultRestaurantsList])
        }
    }, 800)

    const sortBoxStyle = {
        display: 'flex',
        background: '#fff',
        margin: '7px 10px -5px 10px',
        borderRadius: '10px',
        paddingLeft: '10px',
        alignItems: 'center',
    }

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{background: 'rgb(255, 243, 209)', width: `${maxWidth}px`}}>
                <Box sx={styles.sameColor} style={{ height: 'calc(100vh - 64px)', overflow: 'auto' }} >
                    <div style={{ height: 'calc(100% - 5px)', width: '100%', paddingTop: '5px' }}>
                        <div className='list-nav' style={{ margin: '0 10px', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='list-nav-icon'>
                                    <Restaurant sx={{color: '#ff8400'}} />
                                </div>
                                <h2>food</h2>
                            </div>
                            {/* <Autocomplete
                                id="combo-box-demo"
                                options={defaultRestaurantsList.map(i => ({ label: i.name, value: i.id }))}
                                sx={{ width: 300 }}
                                renderInput={(params) => <TextField {...params} label="Search for restaurants" />}
                                onChange={handleChange}
                            /> */}
                            <Search>
                                <SearchIconWrapper>
                                <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(e) => handleChange(e.target.value) }
                                />
                            </Search>
                        </div>
                        <div style={sortBoxStyle}>
                        <Sort sx={{ marginRight: '10px' }} />
                        <FormControl>
                            <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={sortValue}
                                onChange={handleSort}
                            >
                                <FormControlLabel value="default" control={<Radio />} label="Default sorting" />
                                <FormControlLabel value="rate" control={<Radio />} label="High rating" />
                                <FormControlLabel value="count" control={<Radio />} label="High comment count" />
                            </RadioGroup>
                            </FormControl>
                        </div>
                        <div>
                        {
                            restaurantsList.map((item) => (
                            <Card sx={{ width: '320px', height: '388px', display: 'inline-block', boxShadow: 'none', margin: '10px' }}>
                                <Grid container>
                                    <Grid item xs={12} sx={{ height: 200, padding: '10px' }}>
                                        <CardMedia
                                            component="img"
                                            image={item.image}
                                            onClick={() => restaurantDetail(item.id)}
                                            sx={{ cursor: 'pointer', maxHeight: '100%', maxWidth: '100%' }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} className='restaurant-introduction'>
                                        <div style={{display: 'flex', alignItems: 'end'}}>
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
                                                    sx={{ width: '1.2em', height: '1.2em', marginLeft: '10px', color: pink[500], cursor: 'pointer' }}
                                                /> :
                                                <FavoriteBorderRounded
                                                    onClick={() => collect(item)}
                                                    sx={{ width: '1.2em', height: '1.2em', marginLeft: '10px', cursor: 'pointer' }}
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
                    </div>
                </Box>
            </div>
        </div>
    )
}


export default Listing;