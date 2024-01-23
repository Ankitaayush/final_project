const connection = require('../config/db');
const path = require('path')
 
let getVpPage = (req, res)=>{
    if(true){
        connection.query(`SELECT rim.rid, (SELECT requests.req_date FROM requests WHERE requests.rid = rim.rid) as req_date,
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
        ON s1.rm_id = rim.rm_id
        HAVING status_id = 2 AND app1 = 2 AND app2 = 0`, function(error, results, fields) {
            let mp1 = new Map();
            let mp2 = new Map();
            let mp3 = new Map();
            for(let i=0; i<results.length; i++) {
                mp1.set(results[i].rid.toString(), {
                    id : results[i].rid,
                    date : results[i].req_date.toString().substring(0, 15),
                    name : results[i].name,
                    item : []
                });
                mp2.set(results[i].rqid.toString(), {
                    rqid: results[i].rqid,
                    status: results[i].status_id,
                    vendor_name: results[i].vendor_name,
                    vendor_email: results[i].email,
                    contact_person: results[i].contact_person,
                    quote_amount: results[i].quote_amount,
                    quote: results[i].quote,
                    approval1 : results[i].app1,
                    content1: results[i].manager_comment,
                    approval2 : results[i].app2,
                    content1: results[i].vp_comment,
                    po: results[i].purchase_order,
                    invoice: results[i].invoice
                });
            }
            for(let i=0; i<results.length; i++){
                if(!mp3.has(results[i].rid.toString()+","+results[i].itid.toString().toString())){
                    mp1.get(results[i].rid.toString()).item.push({
                        id: results[i].itid,
                        name : results[i].item_name,
                        spec : results[i].item_spec,
                        quantity : results[i].item_quantity,
                        vendor : []
                    })
                    mp3.set(results[i].rid.toString()+","+results[i].itid.toString().toString() ,mp1.get(results[i].rid.toString()).item.length);
                }
                mp1.get(results[i].rid.toString()).item[mp3.get(results[i].rid.toString()+","+results[i].itid.toString().toString())-1].vendor.push(mp2.get(results[i].rqid.toString()));
            }
            let data = [];
            for (let [key, value] of mp1) {
                data.push(value);
            }
            // console.log(data);
            res.send(data);
        });
    } else {
        return res.redirect('/login');
    }  
};
 
const getQuotation = (req, res) => {
    const id = req.params.id;
    const fileName = path.join(__dirname, '../public/', id + '.pdf');
    res.sendFile(fileName)
}
 
const updateStatus = async (req, res) => {
    const { rqid, action, comment } = req.body;
    console.log(req.body);
    const sql = 'UPDATE requeststatuses SET app2 = ?, vp_comment = ? WHERE rqid = ?'
 
    connection.query(sql, [action, comment, rqid], (err, result) => {
        if(err) {
            return res.status(500).json({
                status: 'failure',
                err
            })
        }
 
        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'success',
                err
            })
        }
 
        return res.status(201).json({
            status: 'success'
        })
    })
}
 
module.exports = {
    getVpPage,
    getQuotation,
    updateStatus
}