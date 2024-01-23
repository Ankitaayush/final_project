const connection = require("../config/db");
const nodemailer = require("nodemailer");
const path = require("path");

let trackRequest = (req, res) => {
  // if (req.session.loggedin){
  if (true) {
    connection.query(
      `SELECT rim.rid, (SELECT requests.req_date FROM requests WHERE requests.rid = rim.rid) as req_date,
        (SELECT requests.name FROM requests WHERE requests.rid = rim.rid) as name, rim.itid,
        (SELECT items.item_name FROM items WHERE rim.itid=items.itid) as item_name,
        rim.item_spec, rim.item_quantity, s1.rqid, s1.status_id, s1.vendor_name,
        s1.email, s1.contact_person, s1.quote_amount, s1.quote, s1.app1, s1.manager_comment, s1.app2, s1.vp_comment,
        s1.purchase_order, s1.invoice
        FROM requestitemmaps as rim
        RIGHT JOIN
        (SELECT rs.rqid, v.vendor_name, rs.status_id,
        v.email, v.contact_person, rs.quote_amount, rs.quote, rs.app1,
        rs.manager_comment, rs.app2, rs.vp_comment,
        rs.purchase_order, rs.invoice, rs.rm_id
        FROM requeststatuses AS rs
        LEFT JOIN vendors as v
        ON rs.vid = v.vid
        ) as s1
        ON s1.rm_id = rim.rm_id;`,
      function (error, results, fields) {
        let mp1 = new Map();
        let mp2 = new Map();
        let mp3 = new Map();
        for (let i = 0; i < results.length; i++) {
          mp1.set(results[i].rid.toString(), {
            id: results[i].rid,
            date: results[i].req_date,
            name: results[i].name,
            item: [],
          });
          mp2.set(results[i].rqid.toString(), {
            rqid: results[i].rqid,
            status: results[i].status_id,
            vendor_name: results[i].vendor_name,
            vendor_email: results[i].email,
            contact_person: results[i].contact_person,
            quote_amount: results[i].quote_amount,
            quote: results[i].quote,
            approval1: results[i].app1,
            content1: results[i].manager_comment,
            approval2: results[i].app2,
            content2: results[i].vp_comment,
            po: results[i].purchase_order,
            invoice: results[i].invoice,
          });
        }
        for (let i = 0; i < results.length; i++) {
          if (
            !mp3.has(
              results[i].rid.toString() +
                "," +
                results[i].itid.toString().toString()
            )
          ) {
            mp1.get(results[i].rid.toString()).item.push({
              id: results[i].itid,
              name: results[i].item_name,
              spec: results[i].item_spec,
              quantity: results[i].item_quantity,
              vendor: [],
            });
            mp3.set(
              results[i].rid.toString() +
                "," +
                results[i].itid.toString().toString(),
              mp1.get(results[i].rid.toString()).item.length
            );
          }
          mp1
            .get(results[i].rid.toString())
            .item[
              mp3.get(
                results[i].rid.toString() +
                  "," +
                  results[i].itid.toString().toString()
              ) - 1
            ].vendor.push(mp2.get(results[i].rqid.toString()));
        }
        let data = [];
        for (let [key, value] of mp1) {
          data.push(value);
        }
        //console.log(data);
        res.send(data);
      }
    );
  } else {
    return res.redirect("/login");
  }
};

let trackHistory = (req, res) => {
  // if (req.session.loggedin){

  if (true) {
    connection.query(
      `SELECT rim.rid, (SELECT requests.req_date FROM requests WHERE requests.rid = rim.rid) as req_date,
      (SELECT requests.name FROM requests WHERE requests.rid = rim.rid) as name, rim.itid,
      (SELECT items.item_name FROM items WHERE rim.itid=items.itid) as item_name,
      rim.item_spec, rim.item_quantity, s1.rqid, s1.status_id, s1.vendor_name,
      s1.email, s1.contact_person, s1.quote_amount, s1.quote, s1.app1, s1.manager_comment, s1.app2, s1.vp_comment,
      s1.purchase_order, s1.invoice
      FROM requestitemmaps as rim
      RIGHT JOIN
      (SELECT rs.rqid, v.vendor_name, rs.status_id,
      v.email, v.contact_person, rs.quote_amount, rs.quote, rs.app1,
      rs.manager_comment, rs.app2, rs.vp_comment,
      rs.purchase_order, rs.invoice, rs.rm_id
      FROM requeststatuses AS rs
      LEFT JOIN vendors as v
      ON rs.vid = v.vid
      ) as s1
      ON s1.rm_id = rim.rm_id where app1 = 2 AND app2 = 2 AND status_id = 2 AND purchase_order != '' AND invoice != '';`,
      function (error, results, fields) {
        let mp1 = new Map();
        let mp2 = new Map();
        let mp3 = new Map();
        for (let i = 0; i < results.length; i++) {
          mp1.set(results[i].rid.toString(), {
            id: results[i].rid,
            date: results[i].req_date,
            name: results[i].name,
            item: [],
          });
          mp2.set(results[i].rqid.toString(), {
            rqid: results[i].rqid,
            status: results[i].status_id,
            vendor_name: results[i].vendor_name,
            vendor_email: results[i].email,
            contact_person: results[i].contact_person,
            quote_amount: results[i].quote_amount,
            quote: results[i].quote,
            approval1: results[i].app1,
            content1: results[i].manager_comment,
            approval2: results[i].app2,
            content2: results[i].vp_comment,
            po: results[i].purchase_order,
            invoice: results[i].invoice,
          });
        }
        for (let i = 0; i < results.length; i++) {
          if (
            !mp3.has(
              results[i].rid.toString() +
                "," +
                results[i].itid.toString().toString()
            )
          ) {
            mp1.get(results[i].rid.toString()).item.push({
              id: results[i].itid,
              name: results[i].item_name,
              spec: results[i].item_spec,
              quantity: results[i].item_quantity,
              vendor: [],
            });
            mp3.set(
              results[i].rid.toString() +
                "," +
                results[i].itid.toString().toString(),
              mp1.get(results[i].rid.toString()).item.length
            );
          }
          mp1
            .get(results[i].rid.toString())
            .item[
              mp3.get(
                results[i].rid.toString() +
                  "," +
                  results[i].itid.toString().toString()
              ) - 1
            ].vendor.push(mp2.get(results[i].rqid.toString()));
        }
        let data = [];
        for (let [key, value] of mp1) {
          data.push(value);
        }
        // console.log(data);
        res.status(200).json({ data });
      }
    );
  } else {
    return res.redirect("/login");
  }
};

let createRequest = (req, res) => {
  const { req_name, items } = req.body;

  connection.query(
    `
      INSERT INTO requests VALUES(NULL, 1, NOW(), ? , NOW(), NOW());
  `,
    [req_name],
    function (error, results, fields) {
      let rid = results.insertId;
      for (let i = 0; i < items.length; i++) {
        let rmid = null;
        connection.query(
          `INSERT INTO requestitemmaps VALUES(NULL, ?, ?, ?, ?, NOW(), NOW())`,
          [items[i].itid, items[i].item_spec, items[i].item_quantity, rid],
          function (error, results, fields) {
            rmid = results.insertId;
          }
        );
        connection.query(
          `SELECT * FROM itemvendormaps WHERE itid = ?`,
          [items[i].itid],
          function (error, vendors, fields) {
            connection.query(
              `SELECT item_name FROM items WHERE itid = ?`,
              [items[i].itid],
              function (err, item_name, fields) {
                for (let j = 0; j < vendors.length; j++) {
                  connection.query(
                    `INSERT INTO requeststatuses VALUES(NULL, ?, 0, 0, '', '', ?, '', NOW(), NOW(), 0, '', 0, '')`,
                    [vendors[j].vid, rmid]
                  );
                  connection.query(
                    `SELECT * FROM vendors WHERE vid = ?`,
                    [vendors[j].vid],
                    function (err, vendorDetail, fields) {
                      console.log(vendorDetail);
                      mailTrigger(
                        vendorDetail[j].email,
                        item_name[0].item_name,
                        items[i].item_spec,
                        items[i].item_quantity
                      );
                    }
                  );
                }
              }
            );
          }
        );
      }
      res.send({ status: "Request created successfully." });
    }
  );
};

let updateRequest = (req, res) => {
  let rqid = req.body.rqid;
  let status = req.body.status;
  let quote_amount = req.body.quote_amount;

  if (req.file) {
    const quote = req.file;
    //  console.log(rqid, status, quote_amount, quote)
    connection.query(`UPDATE requeststatuses SET quote = ? WHERE rqid = ?`, [
      quote.path,
      rqid,
    ]);
    connection.query(
      `UPDATE requeststatuses SET status_id = ? WHERE rqid = ?`,
      [status, rqid]
    );
    connection.query(
      `UPDATE requeststatuses SET quote_amount = ? WHERE rqid = ?`,
      [quote_amount, rqid]
    );
  } else {
    connection.query(
      `UPDATE requeststatuses SET status_id = ? WHERE rqid = ?`,
      [status, rqid]
    );
    connection.query(
      `UPDATE requeststatuses SET quote_amount = ? WHERE rqid = ?`,
      [quote_amount, rqid]
    );
  }
  if (status == 2) {
    connection.query(
      `SELECT email FROM users WHERE id = 1`,
      function (error, result, fields) {
        managerTrigger(result[0].email);
      }
    );
  }
  res.send({ status: "Request Updated successfully." });
};

let deleteRequest = (req, res) => {
  let rid = req.params.id;
  connection.query(`DELETE FROM requests WHERE rid = ?`, [rid]);
  connection.query(
    `SELECT rm_id FROM requestitemmaps WHERE requestitemmaps.rid = ?`,
    [rid],
    function (error, results, fields) {
      for (let i = 0; i < results.length; i++) {
        connection.query(`DELETE FROM requestitemmaps WHERE rm_id = ?`, [
          results[i].rm_id,
        ]);
        connection.query(`DELETE FROM requeststatuses WHERE rm_id = ?`, [
          results[i].rm_id,
        ]);
      }
    }
  );

  return res.status(204).json({
    status: "Deleted",
  });
};

const getFile = (req, res) => {
  console.log("reached upto file fun");
  const id = req.params.rqid;
  const doc = req.params.doc;

  console.log(id, doc);
  const sql = "SELECT quote from requeststatuses where rqid = ?";

  connection.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: "failure",
        err,
      });
    }

    let fileName = path.join(__dirname, "../public/", doc + "_" + id + ".pdf");
    console.log(fileName);
    res.set("Content-Type", "application/pdf");
    return res.sendFile(fileName);
  });
};

const mailTrigger = () => {
  console.log("mail starting");
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
    to: "hmishra@fastenal.com",
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
  console.log("mailsent");
};

const managerTrigger = (recipient) => {
  console.log("mail starting");
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
  const url = "http://localhost:3000/login";
  const mailOptions = {
    from: {
      name: "IDC BLR",
      address: "idcassetprocurement@outlook.com",
    },
    to: "aryanjamuar@proton.me",
    subject: "Request for Approval of Quotation for IT Assets",
    html: `
  <p>Dear Manager, <br>I hope this email finds you well. I am writing to request your approval for the quotation we received for the purchase of IT assets for our team. Please visit the link below to approve the request.</p>
  <p>Please visit <a href='http://localhost:3000/login'>here</a> to accept.</p>
  <p>Fastenal India Sourcing IT & Procurement pvt ltd</p>`,
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
  console.log("mailsent");
};

module.exports = {
  trackRequest: trackRequest,
  createRequest: createRequest,
  updateRequest: updateRequest,
  deleteRequest: deleteRequest,
  getFile: getFile,
  trackHistory: trackHistory,
};
