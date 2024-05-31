import React, { useState } from "react";
import { Alert, CardActions, CardContent, CardHeader, Divider, TextField } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const Captcha = () => {
  const randomString = Math.random().toString(36).slice(8);
  const [captcha, setCaptcha] = useState(randomString);
  const [text, setText] = useState("");
  const [valid, setValid] = useState(false);
  const [success, setSuccess] = useState(false);

  const refreshString = () => {
    setText("");
    setCaptcha(Math.random().toString(36).slice(8));
    setSuccess(false); // Reset success state when refreshing
  };

  const verifyCaptcha = () => {
    if (text === captcha) {
      setValid(false);
      setSuccess(true);
    } else {
      setValid(true);
      setSuccess(false);
    }
  };

  const handleInputChange = (event) => {
    setText(event.target.value);
    setValid(false); // Reset validation error when user inputs text
  };

  return (
    <React.Fragment>
      {success && (
        <Alert variant="outlined" sx={{ marginBottom: "20px" }}>
          Successful
        </Alert>
      )}
      <div className="card">
        <CardHeader title="Validate Captcha" />
        <Divider />

        <CardContent>
          <CardActions>
            <div className="h3">{captcha}</div>
            <RefreshIcon onClick={refreshString} style={{ cursor: 'pointer' }} />
          </CardActions>

          <TextField
            label="Enter Captcha"
            focused
            value={text}
            fullWidth
            onChange={handleInputChange}
            error={valid}
            helperText={valid && "Invalid Captcha"}
          />
        </CardContent>
      </div>
    </React.Fragment>
  );
};

export default Captcha;
