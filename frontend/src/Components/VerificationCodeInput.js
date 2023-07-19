import React, { useState } from "react";
import { TextField, Grid } from "@mui/material";

const VerificationCodeInput = () => {
  const [code, setCode] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setCode(value.slice(0, 6)); // 限制最大长度为6位
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace") {
      setCode((prevCode) => prevCode.slice(0, -1)); // 当按下退格键时，删除最后一个验证码
    }
  };

  return (
    <Grid container spacing={1} alignItems="center">
      {[...Array(6)].map((_, index) => (
        <Grid item key={index}>
          <TextField
            variant="outlined"
            size="small"
            type="text"
            value={code[index] || ""}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            inputProps={{
              maxLength: 1,
              style: { textAlign: "center", fontSize: "18px" },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default VerificationCodeInput;
