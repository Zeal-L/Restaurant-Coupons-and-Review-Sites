import "./App.css";
import {Route, Routes} from "react-router-dom";
import React from "react";

import {Context, initialValue} from "./context.js";
import Login from "./Pages/Login";
import TopBar from "./Components/TopBar";
import Register from "./Pages/Register";
import {Notification} from "./Components/Notification.js";
import VoucherVerify from "./Pages/Manage/VoucherVerify";
import Restaurant from "./Pages/Restaurant";
import CreateRestaurant from "./Pages/Manage/CreateRestaurant";
import Listing from "./Pages/Listing";
import VoucherUse from "./Pages/VoucherUse";
import Profile from "./Pages/Profile";
import {createTheme, ThemeProvider} from "@mui/material";
import {EMailVerification} from "./Pages/FindPassword";
import Collect from "./Pages/Collect";

function App() {

  const [popOpen, setPopOpen] = React.useState(initialValue.popOpen);
  const [popMessage, setPopMessage] = React.useState(initialValue.popMessage);
  const [notificationPopOpen, setNotificationPopOpen] = React.useState(initialValue.notificationPopOpen);
  const [notificationPopMessage, setNotificationPopMessage] = React.useState(initialValue.notificationPopMessage);
  const [notificationType, setNotificationType] = React.useState(initialValue.notificationType);
  const [login, setLogin] = React.useState(initialValue.login);
  const [listings, setListings] = React.useState(initialValue.listing);
  const [listShow, setListShow] = React.useState(initialValue.listingShow);
  const [currentUserRestaurantId, setCurrentUserRestaurantId] = React.useState("");

  function showNotification(content, type) {
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
    listShow,
    currentUserRestaurantId
  };
  const setter = {
    setPopOpen,
    setPopMessage,
    setNotificationPopOpen,
    setNotificationPopMessage,
    setNotificationType,
    setLogin,
    setListings,
    setListShow,
    showNotification,
    setCurrentUserRestaurantId
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#68463a",
      },
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider value={{getter, setter}}>
        <TopBar/>
        <Routes>
          <Route path="/" element={<Listing/>}/>
          <Route path="login" element={<Login/>}/>
          <Route path="register" element={<Register/>}/>
          <Route path="/findPassword/identity" element={<EMailVerification/>}/>
          {/*<Route path="/findPassword/reset" element={<ResetPassword/>}/>*/}
          <Route path="/manage/voucher" element={<VoucherVerify/>}/>
          <Route path="/restaurant/:restaurantId" element={<Restaurant subPage="Menu"/>}/>
          <Route path="/restaurant/:restaurantId/menu" element={<Restaurant subPage="Menu"/>}/>
          <Route path="/restaurant/:restaurantId/review" element={<Restaurant subPage="Review"/>}/>
          <Route path="/restaurant/:restaurantId/voucher" element={<Restaurant subPage="Voucher"/>}/>
          <Route path="/manage/create" element={<CreateRestaurant/>}/>
          <Route path="/user/voucher/:voucherId" element={<VoucherUse/>}/>
          <Route path="/user/likedRestaurant" element={<Collect/>}/>
          <Route path="profile" element={<Profile/>}/>
        </Routes>
        <Notification/>
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;
