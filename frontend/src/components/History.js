import React, { useState, useEffect } from "react";
import delete1 from "../assets/delete.ico";
import styles from "../css/table.css";
import axios from "axios";
import NavBar from "./navbar";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";

export default function History() {
  const [sortedData, setSortedData] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: "", asc: true });
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Set your desired items per page
  const [searchInput, setSearchInput] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const handleItemClick = (item) => {
    setSelectedItem(item);
  };
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
      const response = await axios.get(`http://localhost:5000/request/history`);
      let data = response.data.data;

      if (response.data.length > 0) {
        if (searchInput.length > 0)
          data = data.filter((request) =>
            request.name.toLowerCase().includes(searchInput.toLowerCase())
          );
      }
      setSortedData(data);
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
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
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
      <div className="vendor-list2">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by request name"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
        </div>
        <div
          className={`vendor-card2 ${
            selectedItem === "create" ? "selected" : ""
          }`}
          onClick={() => handleItemClick("create")}
        >
          Create new Request
        </div>
        <Accordion>
          {sortedData.map((request) => (
            <AccordionItem id={request.id}>
              {({ open }) => (
                <>
                  <AccordionHeader className="vendorButton2">
                    <div className="accordion-title request-header  acc-req">
                      <h3 style={{ paddingTop: 15 + "px", display: "inline" }}>
                        {request.name}
                      </h3>
                    </div>
                  </AccordionHeader>
                  <AccordionBody styles={{ backgroundColor: "grey" }}>
                    {request.item.map((item) => (
                      <>
                        <div
                          key={item.id}
                          className={`vendor-card2 ${
                            selectedItem === item ? "selected" : ""
                          }`}
                          onClick={() => handleItemClick(item)}
                        >
                          {item.name}
                        </div>
                      </>
                    ))}
                  </AccordionBody>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>

        {/* Pagination controls */}
      </div>
      <div className="table-entity">
        {selectedItem && (
          <div className="ApprovalDiv">
            <table className="customtable">
              <thead>
                <tr>
                  <th onClick={() => handleSort("status")}>Status</th>
                  <th onClick={() => handleSort("vendor_name")}>Vendor Name</th>
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
                {selectedItem.vendor.map((vendor) => (
                  <tr key={vendor.rqid}>
                    <td>{vendor.status == -1 ? "Rejected" : "Accepted"}</td>
                    <td>{vendor.vendor_name}</td>
                    <td>{vendor.vendor_email}</td>
                    <td>{vendor.contact_person}</td>
                    <td>{vendor.quote_amount}</td>
                    <td>
                      <button
                        id={"quoteU_" + vendor.rqid}
                        type="file"
                        onClick={(e) => handleFileDownload(e, vendor.rqid)}
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
                        onClick={(e) => handlePoDownload(e, vendor.rqid)}
                      >
                        View Po
                      </button>
                    </td>
                    <td>
                      <button
                        id={"invoice" + vendor.rqid}
                        type="file"
                        onClick={(e) => handleInvoiceDownload(e, vendor.rqid)}
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
