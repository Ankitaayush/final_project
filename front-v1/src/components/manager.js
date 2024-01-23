import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../css/acc.css';
 
import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";
 
export default function Manager({ initialOpenId }) {
    const [sortedData, setSortedData] = useState([]);
    const [sortOrder, setSortOrder] = useState({ key: '', asc: true });
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Set your desired items per page
    const accordionRefs = useRef({});
   
    useEffect(() => {
      const fetchData = async () => {
 
        try {
          const response = await axios.get(`http://localhost:5000/manager`);
          const data = response.data;
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageData = data.slice(startIndex, endIndex);
            setSortedData(pageData);
          // } else {
          //   console.error('Error fetching data:', response.statusText);
          // }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
 
      // const intervalId = setInterval(() => {
      //   fetchData();
      // }, 5000);
 
      // return () => clearInterval(intervalId);
    }, [currentPage]);
 
    useEffect(() => {
      if (initialOpenId && accordionRefs.current[initialOpenId]) {
        accordionRefs.current[initialOpenId].isActive=true;
        accordionRefs.current[initialOpenId].scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, [initialOpenId]);
 
    const handleApproval = (event, rqid) => {
      console.log(event);
      console.log('Approval clicked for rqid:', rqid);
    };
    const handleRejection = (event, rqid) => {
      console.log(event);
      console.log('Rejection clicked for rqid:', rqid);
    };
   
    const handleInvoiceUpload = (event, rqid) => {
      const file = event.target.files[0];
      console.log('Invoice uploaded for rqid:', rqid, file);
    };
 
    const handleFormSubmit12 = async (status, rqid) => {
      try {
        let formData = {
          'rqid' : rqid,
          'action' : status,
          'comment' : document.getElementById('t_area_'+rqid).value
        }
        console.log(formData);
        const response = await axios.post(`http://localhost:5000/manager`, formData);
        console.log(response);
        alert('Request updated!!')
      } catch (error) {
        console.error("Error manager submitting form:", error);
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

      const handleQuoteDownload = async (event, rqid) => {
        try {
     const response = await axios.get(`http://localhost:5000/request/quote/${rqid}`, { responseType: 'arraybuffer' });
     console.log(response.data)
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
     } catch (err) {
        console.log(err);
     }
      }
 
    return (
      <div class='cover' style={{ overflow: 'auto', width: 85 + 'vw', marginLeft: 'auto', marginRight: 'auto', border: '1px solid grey' }}>
          <Accordion className='acc-item'>
       {sortedData.map((request)=>(
            <AccordionItem  isActive={request.id==initialOpenId}  ref={(ref) => (accordionRefs.current[request.id] = ref)} id={request.id} key={request.id} >
                           <AccordionHeader >
              <h3 className={`accordion-title  acc-req`}>{request.date}-{request.name}</h3>
            </AccordionHeader>
 
                <AccordionBody>
             
                    {
                                                        request.item.map((item) => (
                                                            <AccordionItem isActive={true}>
                                                                <AccordionHeader>
                                                                <h4 className={`accordion-title acc-item`}>{item.name}</h4>
                                                                <p>{item.spec} - {item.quantity}</p>
                                                                </AccordionHeader>
                                                                <AccordionBody>
                                                                <div className='ApprovalDiv'>
  <div className="vendor-info">
    <div>Vendor Name: {item.vendor[0].vendor_name}</div>
    <div>Email: {item.vendor[0].vendor_email}</div>
    <div>Contact Person: {item.vendor[0].contact_person}</div>
  </div>
  <div className="quote-info">
    <div className="quote-amount">Quote Amount: <b>{item.vendor[0].quote_amount}</b></div>
    <a className="download-button" onClick={(e) => handleQuoteDownload(e, item.vendor[0].rqid)}>Download Quote</a>
  </div>
  <textarea id={"t_area_"+item.vendor[0].rqid} className="comment-box" placeholder="Add your comments here..."></textarea>
  <div className="action-buttons">
 
    <button onClick={() => {handleFormSubmit12(1,item.vendor[0].rqid )}} className="reject-button">Reject</button>
    <button onClick={() => {handleFormSubmit12(2,item.vendor[0].rqid )}}className="accept-button">Accept</button>
  </div>
</div>
 
                                                                   
                                                            </AccordionBody>
                                                            </AccordionItem>
                                                            ))
                    }
           
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
 