import React, { useState ,useEffect} from 'react';
import styles from '../css/requestInput.css';

import axios from 'axios'
const RequestInput = () => {
    const [items, setItems] = useState([]);
 let onSubmit=()=>{
    alert('Request created successfully')
 } ;

   useEffect(() => {
    async function fetchData() {
      try {
        // Make API call to fetch data
       
        const item = await axios.get(`http://localhost:5000/it/items`);
        const data = item.data.result;
     
 
        setItems(data);
 
        // const data=response.data.data
 
        // data.shift();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [items]);


   const [name, setName] = useState('');
  const [formFields, setFormFields] = useState([{ item: '', specification: '', quantity: '' }]);

  const handleInputChange = (index, key, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][key] = value;
    setFormFields(updatedFields);
  };

  const handleAddRow = () => {
    setFormFields([...formFields, { item: '', specification: '', quantity: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedFields = [...formFields];
    updatedFields.splice(index, 1);
    setFormFields(updatedFields);
  };

  const handleSubmit = async () => {
    try {
      const requestBody = {
        req_name: name,
        items: formFields.map(({item, specification, quantity}) => ({
          itid: item,
          item_spec: specification,
          item_quantity: quantity
        })),
      };

      //console.log(requestBody)

      const response = await axios.post('http://localhost:5000/request/create', requestBody);
      console.log(response.data)

      setName('');
      setFormFields([{item: '', specification: '', quantity: ''}]);

      onSubmit({ name, items: formFields });
    } catch (err) {
      console.log(err)
    }
  };

  return (
     <div style={{overflow:'auto'}}>
      <div className="request-input-container">
      
        <label className="request-input-label">Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      
      {formFields.map((field, index) => (
        <div key={index} className="request-input-row">
          <label>Item:</label>
          <select
            value={field.item}
            onChange={(e) => handleInputChange(index, 'item', e.target.value)}
          >
            <option value="" disabled>Select an item</option>
            {items.map((item) => (
              <option key={item.itid} value={item.itid}>
                {item.item_name}
              </option>
            ))}
          </select>
          <label>Specification:</label>
          <input
            type="text"
            value={field.specification}
            placeholder="Specification"
            onChange={(e) => handleInputChange(index, 'specification', e.target.value)}
          />
          <label>Quantity:</label>
          <input
            type="text"
            value={field.quantity}
            placeholder="Quantity"
            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
          />
          <button className='delete-btn' onClick={() => handleDeleteRow(index)}>Delete</button>
        </div>
      ))}
      <div  style={{ textAlign: 'left' }}>
        <button onClick={handleAddRow} className="request-input-button">Add Row</button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button onClick={handleSubmit} className="request-input-button">Submit</button>
      </div>
      <div style={{ textAlign: 'center' }}>
      </div>
      </div>
    </div>
  );
};

export default RequestInput;
