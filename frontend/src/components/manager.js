import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styles from '../css/acc.css';
 
import {Accordion, AccordionBody, AccordionHeader, AccordionItem} from "react-headless-accordion";
export default function Manager({ initialOpenId }) {
    const [sortedData, setSortedData] = useState([]);
    const [sortOrder, setSortOrder] = useState({ key: '', asc: true });
    const [selectedOptions, setSelectedOptions] = useState({});
    const [selectedRequest, setSelectedRequest] = useState(null);
      const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
      const [searchInput, setSearchInput] = useState(''); // Set your desired items per page
    const accordionRefs = useRef({});
   const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
    const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setSelectedItem(null);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
    useEffect(() => {
      const fetchData = async () => {
 
        try {
          const response = await axios.get(`http://localhost:5000/manager`);
          let data = response.data;
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
      <div class='cover' >
        <div className='vendor-list2'>

              <div className="search-bar">
                  <input type="text" placeholder="Search by request name" value={searchInput} onChange={handleSearchInputChange} />
              </div>
      <Accordion className='acc-item'>
          {sortedData.map((request)=>(
                <AccordionItem  isActive={request.id==initialOpenId}  ref={(ref) => (accordionRefs.current[request.id] = ref)} id={request.id} key={request.id} >
                <AccordionHeader className='vendorButton2'>
                            <div className="accordion-title request-header  acc-req">         
                      <h3 style={{paddingTop:15+'px',display:'inline'}}>{request.date}-{request.name}</h3>
                  </div>
                </AccordionHeader>
 
                  <AccordionBody styles={{backgroundColor:'grey'}}>
             
                    {
                  request.item.map((item) => (
                  <div
                  key={item.id}
                  className={`vendor-card2 ${selectedItem ===item  ? 'selected' : ''}`}
                  onClick={() => handleItemClick(item)}
                  >
                    
                      {item.name}
                     
                    </div>)) }
                   </AccordionBody>
               </AccordionItem>
                  ))}
</Accordion>
</div>
        <div className="vendor-list2" style={{width:300+'px',textAlign:"center",padding:50+'px',lineHeight:1.6,height:58+'vh'}}>
                      {
                selectedItem && (
                  selectedItem.vendor.map((vendor)=>(                                                 
          <div styles={{padding:'0px auto'}}>
         
            <div styles={{padding:"0 auto"}}>

            <h3>{selectedItem.name}</h3>
            <h5>{selectedItem.spec}</h5>
            </div>
            <div>Vendor Name: {vendor.vendor_name}</div>
            <div>Email: {vendor.vendor_email}</div>
            <div>Contact Person: {vendor.contact_person}</div>
          
          <div className="quote-info">
            <div className="quote-amount">Quote Amount: <b>{vendor.quote_amount}</b></div>
            <a className="download-button" onClick={(e) => handleQuoteDownload(e, vendor.rqid)}>Download Quote</a>
          </div>
          <textarea id={"t_area_"+vendor.rqid} className="comment-box" placeholder="Add your comments here..."></textarea>
          <div className="action-buttons">
        
            <button  onClick={() => {handleFormSubmit12(1,vendor.rqid )}} className="reject-button">Reject</button>
            <button styles={{background:'blue'}} onClick={() => {handleFormSubmit12(2,vendor.rqid )}}className="accept-button">Accept</button>
        </div>
       
          </div>
        )))}
</div>

 
                                                                   
                                                            
                                                          
           
                  
       
       
       
       
    
    
        </div>
      );
  }
 