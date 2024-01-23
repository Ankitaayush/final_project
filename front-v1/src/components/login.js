import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";

import Fastenal from "../assets/Fastenal.png";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Add an interceptor for successful responses
    const successInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle any global errors here
        return Promise.reject(error);
      }
    );

    // Add an interceptor for unsuccessful responses
    const errorInterceptor = axios.interceptors.response.use(
      undefined,
      (error) => {
        // Handle any global errors here
        return Promise.reject(error);
      }
    );

    // Clean up the interceptors when the component is unmounted
    return () => {
      axios.interceptors.response.eject(successInterceptor);
      axios.interceptors.response.eject(errorInterceptor);
    };
  }, []); // Empty dependency array to run this effect only once

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(userName, password);
      const response = await axios.post(
        `http://localhost:5000/login`,
        {
          userName,
          password,
        },
        { withCredentials: true }
      );
      const data = response.data;
      console.log(data);
      localStorage.setItem("token", response.data.token);

      if (data.id == 1) window.location.replace("/manager");
      else if (data.id == 2) window.location.replace("/vp");
      else if (data.id == 3) window.location.replace("/admin");
      else if (data.id == 4) window.location.replace("/it/request/track");
      else window.location.replace("/login");
      // Perform additional actions based on the response, such as redirecting to another page
    } catch (error) {
      console.log(error);
      // Handle errors, such as displaying an error message to the user
    }
  };

  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
      maxWidth={false}
    >
      <Grid container spacing={0}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            position: "relative",
            background: "linear-gradient(to bottom right, #001a33, #004080)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={Fastenal} // Replace with the path to your image
            alt="Company Logo"
            style={{
              width: "100%", // Adjust the width as needed
              height: "10rem", // Maintain aspect ratio
              borderRadius: "8px", // Optional: Add border-radius for rounded corners
            }}
          />
          {/* Pseudo-element to create a curved overlay */}
          <div
            sx={{
              content: '""',
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: "80%",
              background: "linear-gradient(to bottom left, #001a33, #004080)",
              zIndex: 1,
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
            }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Paper elevation={3} sx={{ padding: "20px", width: "80%" }}>
            <Typography
              textAlign="center"
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setUserName(e.target.value)}
              />
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Login
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
