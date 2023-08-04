import React from "react";
import {TransitionUp} from "../styles";
import {Button, Dialog, DialogTitle, Grid} from "@mui/material";

function DeletePop(props) {
  const deleteYes = () => {
    props.setOpen(false);
  };
  const deleteNo = () => {
    props.setOpen(false);
  };
  return (
    <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
      <DialogTitle>Do you want to delete this voucher?</DialogTitle>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{padding: "15px"}}>
        <Grid item xs={7}>
          <Button variant="contained" fullWidth onClick={deleteYes}>Yes</Button>
        </Grid>
        <Grid item xs={7}>
          <Button variant="contained" fullWidth onClick={deleteNo}>Cancel</Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

export default DeletePop;