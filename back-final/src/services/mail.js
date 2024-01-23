const nodemailer = require('nodemailer');
require("dotenv").config();
// wafz ujgx erou ioxn
// Function to send a request for a quote to a vendor
 
const transporter = nodemailer.createTransport({
service: 'gmail',
host:"smtp.gmail.com",
port:587,
secure:false,
auth: {
user: 'fastenalk@gmail.com',
pass: 'wafz ujgx erou ioxn'//app passwaord of gmail account
}
});
 
const mailOptions = {
from: {
name:"IDC BLR",
address:'fastenalk@gmail.com'
},
to:"vendor ka mail",
subject: 'Request for Quote',
text: `Dear Vendor,\n\nWe would like to request a quote for the following item:,\nYour Company Name`
};
 
// await transporter.sendMail(mailOptions);
 
 
const sendMails = async (transporter,mailOptions) => {
try{
await transporter.sendMail(mailOptions)
console.log('Email sent successfully');
}
catch (error)
{
console.log(error);
 
}}
sendMails(transporter,mailOptions);
// Example usage
// const vendorEmail = 'vendor@example.com';
// const item_name = 'Laptop';
// requestQuoteToVendor(vendorEmail, item_name);