// ProtectedRoute.js

import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ component: Component, expectedRole, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      console.log(expectedRole);
      try {
        const response = await axios.get(
          `http://localhost:5000/checkuser/${expectedRole}`,
          {
            // params: ,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log(response.data.status);
        setIsAuthenticated(response.data.status == true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkUserRole();
  }, [expectedRole]);
  console.log(isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace={true} />;
  else return <Component {...rest} />;
};

export default ProtectedRoute;
