import logo from './Resource/logo.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import React from 'react';

import { Context, initialValue } from './context.js';
import Login from "./Pages/Login"
import TopBar from "./Components/TopBar";
import Register from "./Pages/Register";
import { Notification } from './Components/Notification.js';
import Tmp from "./Pages/tmp";
import Restaurant from "./Pages/Restaurant";
import CreateRestaurant from "./Pages/Manage/CreateRestaurant";
import Listing from "./Pages/Listing";
import Vouchsers from "./Pages/Vouchers";
import Profile from "./Pages/Profile";
import {Dialog} from "@mui/material";
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

  return (
      <Context.Provider value={{ getter, setter }}>
        <TopBar/>
        <Routes>
          <Route path="/" element={<Listing/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="tmp" element={<Tmp/>}/>
          <Route path="/restaurant/:restaurantId" element={<Restaurant/>}/>
          <Route path="manage/create" element={<CreateRestaurant/>}/>
          <Route path="vouchers" element={<Vouchsers/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Routes>
        <Notification/>
      </Context.Provider>
  );
}

export default App;
