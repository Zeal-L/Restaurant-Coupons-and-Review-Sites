import React from 'react';
import { TransitionUp } from "../styles";
import {Dialog, Grid, Button, TextField, DialogTitle} from "@mui/material";

function TransforPop(props) {
    const [transferTarget , setTansferTarget] = React.useState('');
    const transferVoucher = () => {
        props.setOpen(false);
    }
    return (
        <Dialog open={props.open} TransitionComponent={TransitionUp} onClose={() => props.setOpen(false)} fullWidth>
            <DialogTitle>
                Transfer Voucher
            </DialogTitle>
            <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: '24px', paddingTop: '0px' }}>
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
                    {/* <div style={{ height: '10px' }}></div> */}
                        <Button 
                        sx = {{
                            padding: "10px",
                        }}  
                        variant="contained" onClick={transferVoucher} fullWidth>Transfer</Button>
                    {/* <div style={{ height: '10px' }}></div> */}
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default TransforPop;