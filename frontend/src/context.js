import React, {createContext} from "react";

export const NotificationType = {
  Success: "success",
  Error: "error",
  Warning: "warning",
  Info: "info",
};
export const initialValue = {
  login: false,
  popOpen: false,
  popMessage: "",
  notificationPopOpen: false,
  notificationPopMessage: "",
  notificationType: NotificationType.Success,
  listingShow: [],
  listing: []
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;
