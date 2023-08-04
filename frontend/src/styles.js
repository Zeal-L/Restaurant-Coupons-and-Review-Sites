import React from "react";
import {Slide} from "@mui/material";

export const styles = {
  sameWidth: {
    width: "240px",
  },
  sameHeightAndWidth: {
    height: "240px",
    width: "240px",
  },
  sameColor: {
    background: "rgb(255, 243, 209)"
  }
};

export const TransitionUp = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
