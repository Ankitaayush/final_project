import React, { useState, useEffect } from 'react';

import styles from '../css/table.css';

import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";

export default function Raccodrian() {
    const [sortedData, setSortedData] = useState([]);
    const [sortOrder, setSortOrder] = useState({ key: '', asc: true });
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Set your desired items per page
  
    
    useEffect(() => {
        // Fetch data from the "/request/all" endpoint when the component mounts
        fetchData();
    
        // Set up an interval to fetch data every, for example, 5 minutes (300,000 milliseconds)
        const intervalId = setInterval(() => {
          fetchData();
        }, 5000); // Adjust the interval as needed
    
        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, [currentPage]);
    
      const fetchData = async () => {
        try {
          // Make API call to fetch data
          const response = await fetch(`/request/all`);
          if (response.ok) {
            const data = await response.json();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
    
            // Slice the data array to get only the items for the current page
            const pageData = data.slice(startIndex, endIndex);
            setSortedData(pageData);
          } else {
            console.error('Error fetching data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
    const handleSelectChange = (e, rqid) => {
      const newSelectedOptions = { ...selectedOptions, [rqid]: e.target.value };
      setSelectedOptions(newSelectedOptions);
      console.log('Status changed for rqid:', rqid);
    };
  
    const handleFileUpload = (event, rqid) => {
      const file = event.target.files[0];
      console.log('File uploaded for rqid:', rqid, file);
    };
  
    const getSelectColor = (rqid) => {
      const selectedOption = selectedOptions[rqid] || '';
      switch (selectedOption) {
        case '-1':
          return 'red';
        case '0':
          return 'yellow';
        case '1':
          return 'green';
        default:
          return 'black';
      }
    };
  
    const handleApproval1 = (rqid) => {
      console.log('Approval 1 clicked for rqid:', rqid);
    };
  
    const handleApproval2 = (rqid) => {
      console.log('Approval 2 clicked for rqid:', rqid);
    };
  
    const handlePODownload = (rqid) => {
      console.log('PO Order Download clicked for rqid:', rqid);
    };
  
    const handleInvoiceUpload = (event, rqid) => {
      const file = event.target.files[0];
      console.log('Invoice uploaded for rqid:', rqid, file);
    };
  
    const handleFormSubmit = async (event, rqid) => {
      try {
        // Your form submission logic here
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
    const handleSort = (key) => {
        const isAsc = sortOrder.key === key ? !sortOrder.asc : true;
      
        const sorted = [...sortedData].map((request) => ({
          ...request,
          item: request.item.map((item) => ({
            ...item,
            vendor: [...item.vendor].sort((a, b) => {
              const valueA = a[key];
              const valueB = b[key];
      
              if (typeof valueA === 'string' && typeof valueB === 'string') {
                return isAsc ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
              }
      
              return isAsc ? valueA - valueB : valueB - valueA;
            }),
          })),
        }));
      
        setSortedData(sorted);
        setSortOrder({ key, asc: isAsc });
      };
  
    return (
      <div class='cover' style={{ overflow: 'auto', width: 85 + 'vw', marginLeft: 'auto', marginRight: 'auto', border: '1px solid grey' }}>
          <Accordion>
       {sortedData.map((request)=>(
            <AccordionItem id={request.id}>
                <AccordionHeader >
                <h3 className={`accordion-title`}>{request.date}-{request.name}</h3>
                
                </AccordionHeader>
                <AccordionBody>
                <Accordion>
                    {
                                                        request.item.map((item) => (
                                                            <AccordionItem>
                                                                <AccordionHeader>
                                                                <h3 className={`accordion-title`}>{item.name}</h3>
                                                                <p>{item.spec} - {item.quantity}</p>
                                                                </AccordionHeader>
                                                                <AccordionBody>
                                                                    <table className='customtable'>
                                                                        <thead>
                                                                                <tr>
                                                                                        <th onClick={() => handleSort('status')}>Status</th>
                                                                                <th onClick={() => handleSort('vendor_name')}>Vendor Name</th>
                                                                                <th onClick={() => handleSort('vendor_email')}>Vendor Email</th>
                                                                                <th onClick={() => handleSort('contact_person')}>Contact Person</th>
                                                                                <th onClick={() => handleSort('quote_amount')}>Quote Amount</th>
                                                                                <th>Quote Upload</th>
                                                                                <th>Approval 1</th>
                                                                                <th>Approval 1 Comments</th>
                                                                                <th>Approval 2</th>
                                                                                <th>Approval 2 Comments</th>
                                                                                <th>PO Order Download</th>
                                                                                <th>Upload Invoice</th>
                                                                                <th>submit</th>
                                                                                </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                    {
                                                                        item.vendor.map((vendor)=>(
                                                            
                                                                <tr key={vendor.rqid}>
                                                                
                                                                    <td>
                                                                    <select id={'status_' + vendor.rqid} defaultValue={vendor.status || ''}
                                                                        onChange={(e) => handleSelectChange(e, vendor.rqid)}
                                                                        // style={{ backgroundColor: getSelectColor(item.rqid) }}
                                                                    >
                                                                        <option value={-1} >Rejected</option>
                                                                        <option value={0}>Following Up</option>
                                                                        <option value={1}>Accepted</option>
                                                                    </select>
                                                                    </td>
                                                                    <td>{vendor.vendor_name}</td>
                                                                    <td>{vendor.vendor_email}</td>
                                                                    <td>{vendor.contact_person}</td>
                                                                    <td><input id={'quote_' + vendor.rqid} type="number" value={vendor.quote_amount}></input></td>
                                                                    <td>
                                                                    {
                                                                        (vendor.quote) ? <a href={vendor.quote}>Download quote</a> :
                                                                        <input id={'quoteU_' + vendor.rqid} type="file" onChange={(e) => handleFileUpload(e, vendor.rqid)} />
                                                                    }
                                                                    </td>
                                                                    <td>
                                                                    { (vendor.approval1 === undefined) ? "pending" : ((vendor.approval1 === 0) ? <span>&#10008; </span> : <span>&#10004;</span>)
                                                                    }
                                                                    </td>
                                                                    <td>
                                                                    {(vendor.content1) ? vendor.content1 : ''}
                                                                    </td>
                                                                    <td>
                                                                    { (vendor.approval2 === undefined) ? "pending" : ((vendor.approval2 === 0) ? <span>&#10008; </span> : <span>&#10004;</span>)
                                                                    }
                                                                    </td>
                                                                    <td>
                                                                    {(vendor.content2) ? vendor.content2 : ''}
                                                                    </td>
                                                                    <td>
                                                                    <a href={vendor.po}>Download</a>
                                                                    </td>
                                                                    <td>
                                                                    {
                                                                        (vendor.invoice) ? <a href={vendor.invoice}>Download invoice</a> :
                                                                        <input id={'invoice_' + vendor.rqid} type="file" onChange={(e) => handleInvoiceUpload(e, vendor.rqid)} />
                                                                    }
                                                                    </td>
                                                                    <td><button className='button' onClick={(e) => handleFormSubmit(e, vendor.rqid)}>submit</button></td>
                                                                </tr>
                                                                ))
                                                            }
                                                            </tbody>
                                                            </table>
                                                            </AccordionBody>
                                                            </AccordionItem>
                                                            ))
                    }
                </Accordion>
                    </AccordionBody> 
            </AccordionItem>          
                        ))
                    }
        </Accordion>
        
        
        
        {/* Pagination controls */}
        <div style={{ textAlign: 'center' }}>
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          <span> Page {currentPage} </span>
          <button disabled={sortedData.length < itemsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      </div>
      );
  }
  