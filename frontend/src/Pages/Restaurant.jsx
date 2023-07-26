import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {BottomNavigation, BottomNavigationAction, Link, Rating} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Unstable_Grid2";
import Menu from "./RestaurantPages/Menu";
import VoucherRest from "./RestaurantPages/VoucherRest";
import Review from "./RestaurantPages/Review";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import {CallApi, CallApiWithToken} from "../CallApi";

function Restaurant(props) {
  const {restaurantId} = useParams();
  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState(props.subPage);
  const [data, setData] = React.useState({
    name: "KFC",
    rating: 4.9,
    comment_count: 200,
    address: "40-50+Arncliffe+Street,+Wolli+Creek+新南威尔士州",
    image: "https://media-cdn.tripadvisor.com/media/photo-s/1b/99/44/8e/kfc-faxafeni.jpg",
  });
  useEffect(() => {
    CallApi(`/restaurants/get/by_id/${restaurantId}`,"GET").then((res) => {
      if (res.status === 200) {
        let address = res.data.address;
        address = address.replace(/ /g, "+");
        address = address.replace(/,/g, "%2C");
        res.data.address = address;
        setData(res.data);
      } else {
        navigate("/");
      }
    })
  }, [restaurantId]);
  const handleAlignment = (event, newAlignment) => {
    if (newAlignment !== null) {
      navigate(`/restaurant/${restaurantId}/${newAlignment}`);
      setAlignment(newAlignment);
    }
  };
  return (
    <>
      <Box
        component="div"
        style={{
          position: "relative",
          width: "100%",
          height: "300px",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={`data:image/png;base64,${data.image}`}
          alt="Restaurant Image"
          width="100%"
          height="100%"
          style={{objectFit: "cover", filter: "blur(6px)"}}
        />
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            width: "80%",
            padding: "16px",
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Grid item>
            <Typography variant="h2" fontFamily="Helvetica" fontWeight="400">
                {data.name}
            </Typography>
          </Grid>
          <Grid item>
            <Rating name="customized-10" value={data.rating} max={5} style={{margin: "10px 0"}} readOnly/>
          </Grid>
          <Grid item>
            <Typography variant="h6" fontFamily="Helvetica" fontWeight="400">
                {data.rating} ({data.comment_count}+ Reviews)
            </Typography>
          </Grid>
          <Grid item>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              marginTop="16px"
            >
              <LocationOnIcon sx={{marginRight: "8px"}}/>
              <Link
                href={"https://www.google.com/maps/place/" + data.address}
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
        <BottomNavigationAction value="Menu" label="Menu" icon={<RestaurantMenuIcon/>}/>
        <BottomNavigationAction value="Voucher" label="Voucher" icon={<ConfirmationNumberIcon/>}/>
        <BottomNavigationAction value="Review" label="Review" icon={<ReviewsIcon/>}/>
      </BottomNavigation>
      {
        alignment === "Menu" ?
          <Menu id={restaurantId}/>
          : alignment === "Voucher" ?
            <VoucherRest id={restaurantId}/>
            :
            <Review id={restaurantId}/>
      }
    </>
  );
}

export default Restaurant;