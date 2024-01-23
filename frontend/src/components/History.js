import React, { useState, useEffect } from "react";

import styles from "../css/table.css";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";

import axios from "axios";

export default function History() {
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "", asc: true });
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
      // const data = [
      //   {
      //     id: 1,
      //     date: '2024-01-19',
      //     name: 'Request 1',
      //     item: [
      //       {
      //         id: 101,
      //         name: 'Item 1',
      //         spec: 'Spec 1',
      //         quantity: 5,
      //         vendor: [
      //           {
      //             rqid: 1001,
      //             status: 1,
      //             vendor_name: 'Vendor A',
      //             vendor_email: 'vendor.a@example.com',
      //             contact_person: 'Person A',
      //             quote_amount: 500,
      //             quote: '/path/to/quote1.pdf',
      //             approval1: 1,
      //             content1: 'Approved by manager',
      //             approval2: 1,
      //             content2: 'Approved by supervisor',
      //             po: '/path/to/po1.pdf',
      //             invoice: '/path/to/invoice1.pdf',
      //           },
      //           {
      //             rqid: 1002,
      //             status: 0,
      //             vendor_name: 'Vendor B',
      //             vendor_email: 'vendor.b@example.com',
      //             contact_person: 'Person B',
      //             quote_amount: 700,
      //             approval1: 0,
      //             content1: 'Rejected by manager',
      //             approval2: undefined,
      //             content2: '',
      //             po: '/path/to/po2.pdf',
      //             invoice: undefined,
      //           },
      //         ],
      //       },
      //       // Add more items if needed
      //     ],
      //   },
      //   {
      //     id: 2,
      //     date: '2024-01-20',
      //     name: 'Request 2',
      //     item: [
      //       // Similar structure as above
      //     ],
      //   },
      //   // Add more requests if needed
      // ];

      const response = await axios.get(`http://localhost:5000/request/history`);
      const data = response.data;

      // export default dummyData;
      //console.log(data);

      // const data = await response.json();
      // const startIndex = (currentPage - 1) * itemsPerPage;
      // const endIndex = startIndex + itemsPerPage;

      // // Slice the data array to get only the items for the current page
      // const pageData = data.slice(startIndex, endIndex);
      setSortedData(data.data);
      //   } else {
      //     console.error('Error fetching data:', response.statusText);
      //   }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileDownload = async (event, rqid) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/request/quote/${rqid}`,
        { responseType: "arraybuffer" }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInvoiceDownload = async (event, rqid) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/request/invoice/${rqid}`,
        { responseType: "arraybuffer" }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePoDownload = async (e, rqid) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/request/po/${rqid}`,
        { responseType: "arraybuffer" }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileUrl = URL.createObjectURL(file);
      window.open(fileUrl);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectChange = (e, rqid) => {
    const newSelectedOptions = { ...selectedOptions, [rqid]: e.target.value };
    setSelectedOptions(newSelectedOptions);
    console.log("Status changed for rqid:", rqid);
  };

  const handleFileUpload = (event, rqid) => {
    const file = event.target.files[0];
    console.log("File uploaded for rqid:", rqid, file);
  };

  const getSelectColor = (rqid) => {
    const selectedOption = selectedOptions[rqid] || "";
    switch (selectedOption) {
      case "-1":
        return "red";
      case "0":
        return "yellow";
      case "1":
        return "green";
      default:
        return "black";
    }
  };

  const handleApproval1 = (rqid) => {
    console.log("Approval 1 clicked for rqid:", rqid);
  };

  const handleApproval2 = (rqid) => {
    console.log("Approval 2 clicked for rqid:", rqid);
  };

  const handlePODownload = (rqid) => {
    console.log("PO Order Download clicked for rqid:", rqid);
  };

  const handleInvoiceUpload = (event, rqid) => {
    const file = event.target.files[0];
    console.log("Invoice uploaded for rqid:", rqid, file);
  };

  const handleFormSubmit = async (event, rqid) => {
    try {
      // Your form submission logic here
    } catch (error) {
      console.error("Error submitting form:", error);
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

          if (typeof valueA === "string" && typeof valueB === "string") {
            return isAsc
              ? valueA.localeCompare(valueB)
              : valueB.localeCompare(valueA);
          }

          return isAsc ? valueA - valueB : valueB - valueA;
        }),
      })),
    }));

    setSortedData(sorted);
    setSortOrder({ key, asc: isAsc });
  };

  return (
    <div class="cover">
      <Accordion>
        {sortedData.map((request) => (
          <AccordionItem id={request.id}>
            <AccordionHeader>
              <h3 className={`accordion-title`}>
                {request.date}-{request.name}
              </h3>
            </AccordionHeader>
            <AccordionBody>
              {request.item.map((item) => (
                <AccordionItem>
                  <AccordionHeader>
                    <h3 className={`accordion-title`}>{item.name}</h3>
                    <p>
                      {item.spec} - {item.quantity}
                    </p>
                  </AccordionHeader>
                  <AccordionBody>
                    <div className="ApprovalDiv">
                      <table className="customtable">
                        <thead>
                          <tr>
                            <th onClick={() => handleSort("status")}>Status</th>
                            <th onClick={() => handleSort("vendor_name")}>
                              Vendor Name
                            </th>
                            <th onClick={() => handleSort("vendor_email")}>
                              Vendor Email
                            </th>
                            <th onClick={() => handleSort("contact_person")}>
                              Contact Person
                            </th>
                            <th onClick={() => handleSort("quote_amount")}>
                              Quote Amount
                            </th>
                            <th>Quote download</th>
                            <th>Approval 1</th>
                            <th>Approval 1 Comments</th>
                            <th>Approval 2</th>
                            <th>Approval 2 Comments</th>
                            <th>PO Order Download</th>
                            <th> Invoice</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.vendor.map((vendor) => (
                            <tr key={vendor.rqid}>
                              <td>
                                {vendor.status == -1 ? "Rejected" : "Accepted"}
                              </td>
                              <td>{vendor.vendor_name}</td>
                              <td>{vendor.vendor_email}</td>
                              <td>{vendor.contact_person}</td>
                              <td>{vendor.quote_amount}</td>
                              <td>
                                <button
                                  id={"quoteU_" + vendor.rqid}
                                  type="file"
                                  onClick={(e) =>
                                    handleFileDownload(e, vendor.rqid)
                                  }
                                >
                                  View quote
                                </button>
                              </td>
                              <td>
                                {vendor.approval1 === 1 ? (
                                  <span>&#10008; </span>
                                ) : (
                                  <span>&#10004;</span>
                                )}
                              </td>
                              <td>{vendor.content1 ? vendor.content1 : ""}</td>
                              <td>
                                {vendor.approval2 === 1 ? (
                                  <span>&#10008; </span>
                                ) : (
                                  <span>&#10004;</span>
                                )}
                              </td>
                              <td>{vendor.content2 ? vendor.content2 : ""}</td>
                              <td>
                                <button
                                  id={"po" + vendor.rqid}
                                  type="file"
                                  onClick={(e) =>
                                    handlePoDownload(e, vendor.rqid)
                                  }
                                >
                                  View Po
                                </button>
                              </td>
                              <td>
                                <button
                                  id={"invoice" + vendor.rqid}
                                  type="file"
                                  onClick={(e) =>
                                    handleInvoiceDownload(e, vendor.rqid)
                                  }
                                >
                                  View Invoice
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionBody>
                </AccordionItem>
              ))}
            </AccordionBody>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Pagination controls */}
      <div style={{ textAlign: "center" }}>
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button
          disabled={sortedData.length < itemsPerPage}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
