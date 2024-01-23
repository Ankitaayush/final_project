// ItemCategoryForm.js
import React, { useState } from 'react';
import '../public/ItemCategoryForm.css'; // Import the CSS file

import axios from 'axios';

const ItemCategoryForm = ({ onAddItem }) => {
  const [name, setName] = useState('');

   const handleSubmit = (e) => {
    e.preventDefault();

    onAddItem({ name });
    setName('');
  };

  return (
    <div>
      <h2>Add Item Name</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
};

export default ItemCategoryForm;
