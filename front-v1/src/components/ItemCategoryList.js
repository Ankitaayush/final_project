// ItemCategoryList.js
import React, {useState, useEffect} from 'react';
import '../public/ItemCategoryForm.css'; // Import the CSS file
import axios from 'axios';

const ItemCategoryList = ({  onDeleteItem }) => {
  const [items, setItems] = useState([]);

  useEffect( () => {
    async function fetchData() {
      try {
      // Make API call to fetch data
      const response = await axios.get(`http://localhost:5000/it/items1`);
      const data=response.data.data
      data.shift();
      
      setItems(data)
      
      console.log(items)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    }
    fetchData()
  }, [items])
  
  
  return (
    <div>
      <h2>Item List</h2>
      <ul>
        
        {items.map((item) => (
          <li key={item.id}>
            {console.log(item)}
            {item.item_name}
            <button onClick={() => onDeleteItem(item.itid)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemCategoryList;
