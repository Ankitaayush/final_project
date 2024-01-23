import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import React, { useState, useEffect } from "react";
import NavBar from "./components/navbar";
import HomeAround from "./components/HomeAround";
import History from "./components/History";
import Request from "./components/Request";
import RequestTable from "./components/requestView";
import RequestInput from "./components/request_input";
import Manager from "./components/manager";
import Po from "./components/po";
import VendorInteraction from "./components/UpadteVendor";
import ItemCategoryForm from "./components/ItemCategoryForm.js";
import ItemCategoryList from "./components/ItemCategoryList.js";
import VendorForm from "./components/VendorInteraction.js";
import Login from "./components/login.js";
import Vp from "./components/vp.js";
import VendorManagement from "./components/vendorManagement.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import axios from "axios";
function App() {
  const handleSubmit = (formData) => {
    // Handle the submitted form data, for now, just log it
    console.log(formData);
  };

  //   const [items, setItems] = useState(() => {
  //   const storedItems = localStorage.getItem('items');
  //   return storedItems ? JSON.parse(storedItems) : [];
  // });

  const handleAddItem = async (newItem) => {
    try {
      const response = await axios.post("http://localhost:5000/it/items", {
        item_name: newItem.name,
      });

      if (response.status === 201) {
        //setItems((prevItems) => [...prevItems, { id: response.data.result.insertId, name: newItem.name }]);
        alert("Item Added");
      } else {
        alert("Error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/it/items/${itemId}`
      );

      if (response.status === 204) {
        //setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
        alert("Item Deleted");
      } else {
        alert("Error");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomeAround />}>
            <Route
              path="it/vendor"
              element={
                <ProtectedRoute component={VendorManagement} expectedRole={4} />
              }
            />

            <Route
              path="it/item"
              element={
                <div>
                  <h1>Item Management</h1>
                  <ItemCategoryForm onAddItem={handleAddItem} />
                  <ItemCategoryList onDeleteItem={handleDeleteItem} />
                </div>
              }
            />

            <Route
              path="it/request/create"
              element={
                <ProtectedRoute component={RequestInput} expectedRole={4} />
              }
            />
            <Route
              path="it/request/track"
              element={
                <ProtectedRoute component={RequestTable} expectedRole={4} />
              }
            />
            <Route
              path="it/request/history"
              element={<ProtectedRoute component={History} expectedRole={4} />}
            />
          </Route>

          <Route
            path="manager"
            element={<ProtectedRoute component={HomeAround} expectedRole={1} />}
          >
            <Route index element={<Manager onFormSubmit={handleSubmit} />} />
          </Route>

          <Route
            path="vp"
            element={<ProtectedRoute component={Vp} expectedRole={2} />}
          />
          <Route
            path="admin"
            element={<ProtectedRoute component={Po} expectedRole={3} />}
          />

          {/* Add additional routes or components as needed */}
        </Routes>
      </Router>
    </div>
  );
}
export default App;
