import React from "react";
import {TransitionUp} from "../styles";
import {Button, Dialog, DialogTitle, Grid, TextField} from "@mui/material";
import { CallApi, CallApiWithToken } from "../CallApi";
import {Context, NotificationType, useContext} from "../context.js";
import {LoadingButton} from "@mui/lab";

function TransforPop(props) {
  const {setter} = useContext(Context);
  const [transferTarget, setTansferTarget] = React.useState("");
  const [transferid, setTransgerId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const transferVoucher = () => {
    setLoading(true);
    CallApi(`/users/get/by_email/${transferTarget}`, "GET").then((res) => {
      if (res.status === 200) {
        setTransgerId(res.data.user_id);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
    CallApiWithToken(`/vouchers/transfer/${props.id}/${transferid}` + props.id, "POST").then((res) => {
      if (res.status === 200) {
        setter.showNotification(res.data.message, NotificationType.Success);
        props.setOpen(false);
        setLoading(false);
      } else {
        setter.showNotification(res.data.message, NotificationType.Error);
      }
    });
  };
  return (
    <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>
        Transfer Voucher
      </DialogTitle>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{padding: "24px", paddingTop: "0px"}}>
        <Grid item xs={12}>
          <TextField
            label="Email"
            value={transferTarget}
            onChange={(e) => setTansferTarget(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <LoadingButton
            loadingPosition="start"
            loading={loading}
            sx={{
              padding: "10px",
            }}
            variant="contained" onClick={transferVoucher} fullWidth>Transfer</LoadingButton>
        </Grid>
        <Grid item xs={12}>
          <Button variant="text" color="primary" fullWidth onClick={() => props.setOpen(false)}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default TransforPop;