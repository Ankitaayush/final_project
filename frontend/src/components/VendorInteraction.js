import React, { useState } from "react";
import Select from "react-select";
 
import axios from "axios";
import "../public/vecti.css"; // Import the CSS file
 
const VendorForm = ({ allItems }) => {
  const [formData, setFormData] = useState({
    vendorName: "",
    email: "",
    contactPerson: "",
    phone: "",
    selectedItems: [],
  });
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
 
  const handleSelectChange = (selectedOptions) => {
    const selectedItems = selectedOptions.map((option) => option.value);
    setFormData((prevData) => ({
      ...prevData,
      selectedItems,
    }));
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.error({ itid: formData.selectedItems, ...formData });
    axios
      .post(
        `http://localhost:5000/it/vendors`,
        { itid: formData.selectedItems, ...formData },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log("Update successful:", response.data); // Perform any additional actions after a successful update    })     .catch((error) => {       console.error('Update failed:', error);       // Handle errors here    });
      })
      .catch(function (error) {
        console.log(error);
      });
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
          defaultValue={formData.vendorName}
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
          defaultValue={formData.contactPerson}
          onChange={handleChange}
          required
        />
      </label>
 
      <label>
        Phone No:
        <input
          type="tel"
          name="phone"
          defaultValue={formData.phone}
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
            formData.selectedItems.includes(option.value)
          )}
          onChange={handleSelectChange}
          required
        />
      </label>
 
      <button type="submit">Submit</button>
    </form>
  );
};
 
export default VendorForm;