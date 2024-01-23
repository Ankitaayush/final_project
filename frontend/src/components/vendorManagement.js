import React, { useState, useEffect } from "react";
import axios from "axios";
import VendorForm from "./VendorInteraction";
import VendorInteraction from "./UpadteVendor";
import "../css/vendorManagement.css";
 
const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [allItems, setItems] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
 
  useEffect(() => {
    async function fetchData() {
      try {
        // Make API call to fetch data
        const response = await axios.get(`http://localhost:5000/it/vendors`);
        setVendors(response.data.result);
        const item = await axios.get(`http://localhost:5000/it/items`);
        const data = item.data.result;
        console.log("response", response.data.result);
 
        setItems(data);
 
        // const data=response.data.data
 
        // data.shift();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [vendors]);
 
  const handleVendorClick = (vendor) => {
    setSelectedVendor(vendor);
  };
 
  const handleAddNewVendor = () => {
    setSelectedVendor(null);
  };
 
  const handleFormSubmit = (formData) => {
    if (selectedVendor) {
      const updatedVendors = vendors.map((vendor) =>
        vendor.vid === selectedVendor.vid ? { ...vendor, ...formData } : vendor
      );
      setVendors(updatedVendors);
    } else {
      const newVendor = { vid: vendors.length + 1, ...formData };
      setVendors([...vendors, newVendor]);
    }
 
    setSelectedVendor(null);
  };
 
  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(searchTerm.toLowerCase())
   
  );
 
  return (
    <div className="vendor-management">
      <div className="vendor-list">
        <h2>Vendors</h2>
        <input
          type="text"
          placeholder="Search by vendor name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={`vendorButton ${
            selectedVendor === null ? "selected" : ""
          }`}
          onClick={handleAddNewVendor}
        >
          Add New Vendor
        </button>
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.vid}
            className={`vendor-card ${
              selectedVendor === vendor ? "selected" : ""
            }`}
            onClick={() => handleVendorClick(vendor)}
          >
            {vendor.vendor_name}
          </div>
        ))}
      </div>
 
      <div className="vendor-form">
        {selectedVendor ? (
          <VendorInteraction
            initialData={selectedVendor}
            key={selectedVendor.vid}
            allItems={allItems}
          />
        ) : (
          <VendorForm allItems={allItems} onSubmit={handleFormSubmit} />
        )}
      </div>
    </div>
  );
};
 
export default VendorManagement;