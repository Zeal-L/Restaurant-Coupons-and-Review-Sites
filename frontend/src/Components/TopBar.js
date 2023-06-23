import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {useNavigate} from "react-router-dom";
export default function TopBar() {

    const navigate = useNavigate();
    return (
        <Box sx={{ flexGrow: 1 , backgroundColor: 'rgb(255, 243, 209)'}}>
            <AppBar position="absolute" sx={{ backgroundColor: 'rgb(255, 243, 209)'}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        aria-label="menu"
                        sx={{ mr: 2}}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} color={"black"} onClick={() => {window.location.href = "/"}} style={{ cursor: 'pointer' }}>
                        Donut Voucher
                    </Typography>
                    <Button color="inherit" sx={{ color: 'black' }} onClick={() => {navigate('/login')}}>Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}