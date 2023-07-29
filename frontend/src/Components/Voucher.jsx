import React from "react";
import {Typography} from "@mui/material";
// import { ReactComponent as VoucherIcon } from '../voucher.svg';
import Grid from "@mui/material/Unstable_Grid2";


import blueVoucher from "../Resource/voucher/blue.png";
import greenVoucher from "../Resource/voucher/green.png";
import purpleVoucher from "../Resource/voucher/purple.png";
import yellowVoucher from "../Resource/voucher/yellow.png";
import PropTypes from "prop-types";
import VoucherInfoPop from "./VoucherInfoPop";
import dayjs from "dayjs";

function Voucher(props) {
  const {type, condition, discount, expire, isListing = false} = props;
  let url = "";
  if (type === "Fixed Amount") {
    url = blueVoucher;
  } else if (type === "Percentage") {
    url = greenVoucher;
  } else if (type === "Free") {
    url = purpleVoucher;
  } else if (type === "CFree") {
    url = yellowVoucher;
  }
  const [popOpen, setPopOpen] = React.useState(false);
  const disabled = props.disabled ? props.disabled : false;
  const used = false ? props.used === undefined : props.used;
  const transform = props.transform ? props.transform : "1";
  const width = 366 * transform;
  const height = 196 * transform;
  // const havePop = props.pop ? props.pop : true;
  return (
    <>
      {!isListing ? <Grid container sx={{
        ...props.sx,
        width: `${width}px`,
        height: `${height}px`,
        padding: "24px",
        backgroundImage: `url(${url})`,
        backgroundSize: "contain",
        cursor: props.pop === true || props.pop === undefined ? "pointer" : "default",
        filter: disabled || used ? "grayscale(100%)" : "none",
      }}
      onClick={() => setPopOpen(true)}
      >
        <Grid item xs={12} sx={{alignSelf: "center"}}>
          <Typography variant="subtitle1" color="white" sx={{textAlign: "center"}}>
            {condition}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{alignSelf: "center"}}>
          <Typography variant={isListing ? "body2" : "h3"} component="h1" color="white"
            sx={{textAlign: "center", fontWeight: 600}}>
            {discount}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{alignSelf: "center"}}>
          <Typography variant="body1" color="white" sx={{textAlign: "center"}}>
            {dayjs.unix(expire).format("DD MMM YYYY")}
          </Typography>
        </Grid>
      </Grid> :
        <Grid
          container
          sx={{
            ...props.sx,
            width: `${width}px`,
            height: `${height}px`,
            backgroundImage: `url(${url})`,
            backgroundSize: "contain",
            overflow: "hidden",
            whiteSpace: "nowrap",
            flexDirection: "column",
            justifyContent: "center",
            cursor: props.pop === true || props.pop === undefined ? "pointer" : "default",
            filter: disabled || used ? "grayscale(100%)" : "none",
          }}
          onClick={() => setPopOpen(true)}
        >
          <Grid item xs={12} sx={{alignSelf: "center"}}>
            <Typography color="white" sx={{textAlign: "center", fontSize: "x-small", transform: "scale(0.7)"}}>
              {condition}
            </Typography>
          </Grid>
          <Grid item>
            <Typography color="white" sx={{textAlign: "center"}}>
              {discount}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{alignSelf: "center"}}>
            <Typography color="white" sx={{textAlign: "center", fontSize: "x-small", transform: "scale(0.7)"}}>
              {/*{expire}*/}
              {dayjs.unix(expire).format("DD MMM YYYY")}
            </Typography>
          </Grid>
        </Grid>}
      {(props.pop === true || props.pop === undefined) &&
        <VoucherInfoPop
        open={popOpen}
        setOpen={setPopOpen}
        id={props.id}
        isRestaurant={props.isRestaurant}
        used={used}
      />
      }
    </>
  );
}

Voucher.protoType = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  condition: PropTypes.string.isRequired,
  discount: PropTypes.string.isRequired,
  expire: PropTypes.string.isRequired,
  transform: PropTypes.string,
  isListing: PropTypes.bool,
  disabled: PropTypes.bool,
  isRestaurant: PropTypes.bool,
  used: PropTypes.bool,
};


export default Voucher;
