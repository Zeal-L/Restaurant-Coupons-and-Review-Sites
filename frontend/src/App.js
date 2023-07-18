import logo from './Resource/logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import React from 'react';

import { Context, initialValue } from './context.js';
import Login from "./Pages/Login"
import TopBar from "./Components/TopBar";
import Register from "./Pages/Register";
import { Notification } from './Components/Notification.js';
import VoucherVerify from "./Pages/tmp";
import Restaurant from "./Pages/Restaurant";
import CreateRestaurant from "./Pages/Manage/CreateRestaurant";
import Listing from "./Pages/Listing";
import VoucherUse from "./Pages/Use";
import Profile from "./Pages/Profile";
import {createTheme, Dialog, ThemeProvider} from "@mui/material";
import * as PropTypes from "prop-types";
import {EMailVerification,ResetPassword} from "./Pages/FindPassword";
function App() {

  const [popOpen, setPopOpen] = React.useState(initialValue.popOpen);
  const [popMessage, setPopMessage] = React.useState(initialValue.popMessage);
  const [notificationPopOpen, setNotificationPopOpen] = React.useState(initialValue.notificationPopOpen);
  const [notificationPopMessage, setNotificationPopMessage] = React.useState(initialValue.notificationPopMessage);
  const [notificationType, setNotificationType] = React.useState(initialValue.notificationType);
  const [login, setLogin] = React.useState(initialValue.login);
  const [listings, setListings] = React.useState(initialValue.listing);
  const [listShow, setListShow] = React.useState(initialValue.listingShow);

  function showNotification (content, type) {
    setNotificationPopMessage(content);
    setNotificationType(type);
    setNotificationPopOpen(true);
  }

  const getter = {
    popOpen,
    popMessage,
    notificationPopOpen,
    notificationPopMessage,
    notificationType,
    login,
    listings,
    listShow
  }
  const setter = {
    setPopOpen,
    setPopMessage,
    setNotificationPopOpen,
    setNotificationPopMessage,
    setNotificationType,
    setLogin,
    setListings,
    setListShow,
    showNotification
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#68463a',
      },
    }
  });

  return (
      <ThemeProvider theme={theme}>
        <Context.Provider value={{ getter, setter }}>
            <TopBar/>

              <Routes>
                <Route path="/" element={<Listing/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="register" element={<Register/>}/>
                <Route path="/findPassword/identity" element={<EMailVerification/>}/>
                <Route path="/findPassword/reset" element={<ResetPassword/>}/>
                <Route path="/manage/voucher" element={<VoucherVerify/>}/>
                <Route path="/restaurant/:restaurantId" element={<Restaurant/>}/>
                <Route path="manage/create" element={<CreateRestaurant/>}/>
                <Route path="/user/voucher/:voucherId" element={<VoucherUse/>}/>
                <Route path="profile" element={<Profile/>}/>
              </Routes>
            <Notification/>
        </Context.Provider>
      </ThemeProvider>
  );
}

export default App;
