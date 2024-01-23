// const nodemailer = require("nodemailer");
// require("dotenv").config();
// // wafz ujgx erou ioxn
// // Function to send a request for a quote to a vendor

// let transporter = nodemailer.createTransport("SMTP", {
//   host: "smtp-mail.outlook.com",
//   secureConnection: false,
//   port: 587,
//   auth: {
//     user: "idcassetprocurement@outlook.com",
//     pass: "Qwerty@1234", //app passwaord of gmail account
//   },
//   tls: {
//     ciphers: "SSLv3",
//   },
// });

// let mailOptions = {
//   from: {
//     name: "IDC BLR",
//     address: "idcassetprocurement@outlook.com",
//   },
//   to: "ajamuar@fastenal.com",
//   subject: "Request for Quote",
//   text: `Dear Vendor,\n\nWe would like to request a quote for the following item:,\nYour Company Name`,
// };

// // await transporter.sendMail(mailOptions);
// // transporter.sendMail(mailOptions,function
// // {
// //     try {
// //         await transporter.sendMail(mailOptions);
// //         console.log("Email sent successfully");
// //       } catch (error) {
// //         console.log(error);
// //       }
// // })
// const sendMails = async (transporter, mailOptions) => {
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully");
//   } catch (error) {
//     console.log(error);
//   }
// };
// sendMails(transporter, mailOptions);

const nodemailer = require("nodemailer");
require("dotenv").config();

// Function to send a request for a quote to a vendor
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secureConnection: false,
  auth: {
    user: "idcassetprocurement@outlook.com",
    pass: "Qwerty@1234", //app password of outlook account
  },
  tls: {
    ciphers: "SSLv3",
  },
});

const mailOptions = {
  from: {
    name: "IDC BLR",
    address: "idcassetprocurement@outlook.com",
  },
  to: "ajamuar@fastenal.com",
  subject: "Request for Quote",
  text: `Dear Vendor,\n\nWe would like to request a quote for the following item:,\nYour Company Name`,
};

const sendMails = async (transporter, mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log(error);
  }
};

sendMails(transporter, mailOptions);
