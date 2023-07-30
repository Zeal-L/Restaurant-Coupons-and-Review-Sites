import React from "react";
import {Context, NotificationType, useContext} from "../context.js";
import {useNavigate} from "react-router-dom";
import {TransitionUp} from "../styles";
import {Button, Chip, CircularProgress, colors, Dialog, DialogTitle, Grid, Link, Typography} from "@mui/material";
import Voucher from "./Voucher";
import TransforPop from "./TransferPop.jsx";
import {CallApi, CallApiWithToken} from "../CallApi";
import dayjs from "dayjs";

function VoucherInfoPop(props) {
  const {getter, setter} = useContext(Context);
  const [transferOpen, setTransferOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const isRestaurant = props.isRestaurant;
  const used = false ? props.used === undefined : props.used;
  console.log(props.id);
  const [info, setInfo] = React.useState({});
  React.useEffect(() => {
    if (isRestaurant) {
      setLoading(true);
      CallApiWithToken("/vouchers/get/template/by_id/" + props.id, "GET").then((res) => {
        if (res.status === 200) {
          console.log(res);
          setInfo(res.data);
        }
        setLoading(false);
        console.log(res);
      });
    } else {
      setLoading(true);
      CallApiWithToken("/vouchers/get/voucher/by_id/" + props.id, "GET").then((res) => {
        if (res.status === 200) {
          console.log(res);
          setInfo(res.data);
        }
        setLoading(false);
        console.log(res);
      });
    }
  }, [props.open]);

  const getVoucher = () => {
    CallApiWithToken("/vouchers/user/collect/" + props.id, "POST").then((res) => {
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        props.setOpen(false);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
  }

  const descriptionStyle = {
    marginBottom: "16px",
    textAlign: "center",
  };

  const linkStyle = {
    cursor: "pointer",
    color: "#1976D2",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  };

  return (
    <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>Voucher Information</DialogTitle>
      {loading ?
        <>
          <CircularProgress />
        </> :
        // 纵向排序
        // <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{padding: "24px"}}>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={2} sx={{padding: "24px"}}>
        <Grid item alignItems="center">
          <Voucher
            type={info.type}
            condition={info.condition}
            discount={info.discount}
            expire={dayjs.unix(info.expire).format("DD/MM/YYYY")}
            pop={false}
          />
        </Grid>
        {isRestaurant &&
          <Grid item>
            <Chip label={`Total ${info.total_amount} vouchers, ${info.remain_amount} left.`}/>
          </Grid>
        }
        <Grid item xs={12}>
          <Typography variant="body2" style={descriptionStyle}>
            This voucher is provided by{" "}
            <Link
              href={`/restaurant/${info.restaurant_id}`}
              sx={linkStyle}
            >
              {info.restaurant_name}
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
            This voucher expires on {dayjs.unix(info.expire).format("DD/MM/YYYY")}
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
                <Button variant="contained" color="primary" fullWidth onClick={() => {getVoucher()}}>
                  Get this voucher
                </Button>
              </Grid>
              :
              <>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={() => {
                    navigate("/user/voucher/" + info.voucher_id);
                  }} fullWidth>
                    Use this voucher
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" onClick={() => {
                    setTransferOpen(true);
                    console.log(transferOpen);
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
      }
      {transferOpen === true && <TransforPop open={transferOpen} setOpen={setTransferOpen} id={props.id}/>}
    </Dialog>
  );
}

export default VoucherInfoPop;
