import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../public/vecti.css"; // Import the CSS file
import axios from "axios";
const VendorInteraction = ({ initialData, key, allItems }) => {
  const [formData, setFormData] = useState(initialData);
 
  const [vendorId, setVendorId] = useState(initialData.vid);
 
  // Extract selectedItems from initialData and set it initially
  useEffect(() => {
    if (initialData && initialData.selectedItems) {
      setFormData((prevData) => ({
        ...prevData,
        selectedItems: initialData.selectedItems,
      }));
    }
  }, [initialData]);
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectChange = (selectedOptions) => {
    let selectedItems = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      selectedItems,
    }));
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
   // selectedItems = selectedOptions.map((option) => option.value);
    const formDataWithId = {
      id: vendorId,
      itid: formData.item_id,
      ...formData,
    };
    console.error(formDataWithId);
    axios
      .patch(`http://localhost:5000/it/vendors/${vendorId}`, formDataWithId, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log("Update successful:", response.data); // Perform any additional actions after a successful update    })     .catch((error) => {       console.error('Update failed:', error);       // Handle errors here    });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
 
  const handleDelete = () => {
    console.log("Delete request initiated.");
    // Implement delete functionality here
  };
 
  const options = allItems.map((item) => ({
    value: item.itid,
    label: item.item_name,
  }));
 
  return (
    <form className="vendor-form" onSubmit={handleSubmit}>
      <label>
        Vendor Name:
        <input
          type="text"
          name="vendor_name"
          defaultValue={formData.vendor_name}
          onChange={handleChange}
          required
        />
      </label>
 
      <label>
        Email:
        <input
          type="email"
          name="email"
          defaultValue={formData.email}
          onChange={handleChange}
          required
        />
      </label>
 
      <label>
        Contact Person:
        <input
          type="text"
          name="contact_person"
          defaultValue={formData.contact_person}
          onChange={handleChange}
          required
        />
      </label>
 
      <label>
        Phone No:
        <input
          type="tel"
          name="phone"
          defaultValue={formData.phone_no}
          onChange={handleChange}
          required
        />
      </label>
 
      <label>
        Items:
        <Select
          isMulti
          name="itid"
          options={options}
          defaultValue={options.filter((option) =>
            formData.item_id.includes(option.value)
          )}
          onChange={handleSelectChange}
          required
        />
      </label>
 
      <button type="submit">Update</button>
      <button type="button" onClick={handleDelete}>
        Delete
      </button>
    </form>
  );
};
 
export default VendorInteraction;