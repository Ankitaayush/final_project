import React, { useState, useEffect, useRef } from 'react';
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'react-headless-accordion';
import DragDropFile from './DragDropFile';
import '../css/po.css'; // Import your CSS file

import axios from 'axios'
 
export default function Po({ initialOpenId }) {
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: '', asc: true });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set your desired items per page
  const accordionRefs = useRef({});
 
  const handleInvoiceUpload = async (event, rqid) => {
    // ... your existing code for handling invoice upload
    try {
     const formData = new FormData();
     formData.append('rqid', rqid);
      if(document.getElementById('invoice_'+rqid)) {
            formData.append('invoice', document.getElementById('invoice_'+rqid).files[0], `invoice_${rqid}.pdf`);
        }

        const response = await axios.post('http://localhost:5000/admin/invoice', formData);
        console.log(response);
        alert('Request updated!!')
    } catch (err) {
      console.log(err)
    }
  };
 
  const handlePoUpload = async (event, rqid) => {
    // ... your existing code for handling PO upload
    try {
     const formData = new FormData();
     formData.append('rqid', rqid);
      if(document.getElementById('po_'+rqid)) {
            formData.append('po', document.getElementById('po_'+rqid).files[0], `po_${rqid}.pdf`);
        }

        const response = await axios.post('http://localhost:5000/admin/PO', formData);
        console.log(response);
        alert('Request updated!!')
    } catch (err) {
      console.log(err)
    }
  };
 
  // useEffect(() => {
  //   // fetchData();
 
  //   // const intervalId = setInterval(() => {
  //   //   fetchData();
  //   // }, 5000);
 
  //   // return () => clearInterval(intervalId);
  // }, [currentPage]);


 
  useEffect(() => {
    if (initialOpenId && accordionRefs.current[initialOpenId]) {
      accordionRefs.current[initialOpenId].isActive = true;
      accordionRefs.current[initialOpenId].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [initialOpenId]);
 
  useEffect(() => {
      const fetchData = async () => {
 
        try {
          const response = await axios.get(`http://localhost:5000/admin`);
          const data = response.data;
          console.log(data)
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

    const handleQuoteDownload = async (event, rqid) => {
        try {
        const response = await axios.get(`http://localhost:5000/request/quote/${rqid}`, { responseType: 'arraybuffer' });
        // console.log(response.data)
          const file = new Blob([response.data], { type: 'application/pdf' });
          const fileUrl = URL.createObjectURL(file);
          window.open(fileUrl);
        } catch (err) {
            console.log(err);
        }
      }

      const handlePoDownload = async (e, rqid) => {
      try {
        
      const response = await axios.get(`http://localhost:5000/request/po/${rqid}`, { responseType: 'arraybuffer' });
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl);
      } catch (err) {
          console.log(err);
      }
  };

  const handleInvoiceDownload = async (e, rqid) => {
      try {
        
      const response = await axios.get(`http://localhost:5000/request/invoice/${rqid}`, { responseType: 'arraybuffer' });
        const file = new Blob([response.data], { type: 'application/pdf' });
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl);
      } catch (err) {
          console.log(err);
      }
  };
 
  const handleApproval1 = (rqid) => {
    console.log('Approval 1 clicked for rqid:', rqid);
  };
 
  const handleFormSubmit = async (event, rqid) => {
    try {
      // Your form submission logic here
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };
 
  const handleSort = (key) => {
    // ... your existing code for handling sorting
  };
 
  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setSelectedItem(null);
  };
 
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
 
  return (
    <div className='po-cover' style={{ overflow: 'auto', display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}>
      <div className='po-left-column'>
        {/* Left column - Requests */}
        {sortedData.map((request) => (
          <Accordion
            key={request.id}
            isActive={selectedRequest && selectedRequest.id === request.id}
            ref={(ref) => (accordionRefs.current[request.id] = ref)}
            id={request.id}
          >
            <AccordionHeader onClick={() => handleRequestClick(request)}>
              <h3 className={`po-accordion-title po-acc-req`}>{request.date}-{request.name}</h3>
            </AccordionHeader>
            <AccordionBody>
              {/* Items of the selected request */}
              {request.item.map((item) => (
                <div
                  key={item.id}
                  className={`po-accordion-title po-acc-item ${selectedItem && selectedItem.id === item.id ? 'selected' : ''}`}
                  onClick={() => handleItemClick(item)}
                >
                  {item.name}
                </div>
              ))}
            </AccordionBody>
          </Accordion>
        ))}
      </div>
      <div className='po-right-column'>
        {/* Right column - Item details */}
        {selectedItem && (
          <div>
            <div className="po-vendor-info">
              <div>Vendor Name: {selectedItem.vendor[0].vendor_name}</div>
              <div>Email: {selectedItem.vendor[0].vendor_email}</div>
              <div>Contact Person: {selectedItem.vendor[0].contact_person}</div>
            </div>
            <div className="po-quote-info">
              <div className="po-quote-amount">Quote Amount: <b>{selectedItem.vendor[0].quote_amount}</b></div>
              <a className="po-download-button" onClick={(e) => handleQuoteDownload(e, selectedItem.vendor[0].rqid)}>Download Quote</a>
            </div>
            <div className="po-upload-buttons">
              {selectedItem.vendor[0].po ? (
                <a className="po-download-button" onClick={(e) => handlePoDownload(e, selectedItem.vendor[0].rqid)} target="_blank" rel="noopener noreferrer">
                  Download PO
                </a>
              ) : (
                <>
                  <DragDropFile name={`po_${selectedItem.vendor[0].rqid}`} id={`po_${selectedItem.vendor[0].rqid}`} selectedFile={selectedOptions[selectedItem.vendor[0].rqid]?.invoice} setSelectedFile={(file) => handlePoUpload(file, selectedItem.vendor[0].rqid)} />
                </>
              )}
              <br></br>
              {selectedItem.vendor[0].invoice ? (
                <button className="invoice-download-button" onClick={(e) => handleInvoiceDownload(e, selectedItem.vendor[0].rqid)} target="_blank" rel="noopener noreferrer">
                  Download Invoice
                </button>
              ) : (
                <>
                  <DragDropFile name={`invoice_${selectedItem.vendor[0].rqid}`} id={`invoice_${selectedItem.vendor[0].rqid}`} selectedFile={selectedOptions[selectedItem.vendor[0].rqid]?.invoice} setSelectedFile={(file) => handleInvoiceUpload(file, selectedItem.vendor[0].rqid)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Pagination controls */}
     
    </div>
  );
}