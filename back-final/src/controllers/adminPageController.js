const path = require('path');
const connection = require('../config/db');

let uploadPo = (req, res) => {
    return res.send({text : "File Successfully Uploaded"});
}

let openPo = (req, res) => {
    let id = req.params.id;
    let fileName = path.join(__dirname, '../public/', id + '.pdf');
    res.sendFile(fileName)
}

let getAdminPage = (req, res) => {
    if(req.session.loggedin){
        return res.send({text : "Welcome to admin page."}); 
    } else {
        return res.redirect('/login')
    }
}

const postPO = (req, res) => {
    const rqid = req.params.id;

    const { path } = req.body;
    const sql = 'UPDATE requeststatuses SET purchase_order = ? WHERE rqid = ?';

    connection.query(sql, [path, rqid], (err, result) => {
        if(err) {
            res.status(500).json({
                status: 'failure',
                err
            })
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                status: 'failure',
                err
            })
        }

        return res.status(201).json({
            status: 'success',
        })
    })
}

const postInvoice = (req, res) => {
    const rqid = req.params.id;

    const { path } = req.body;
    const sql = 'UPDATE requeststatuses SET invoice = ? WHERE rqid = ?';

    connection.query(sql, [path, rqid], (err, result) => {
        if(err) {
            res.status(500).json({
                status: 'failure',
                err
            })
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                status: 'failure',
                err
            })
        }

        return res.status(201).json({
            status: 'success',
        })
    })
}

module.exports = {
    uploadPo : uploadPo,
    openPo : openPo,
    getAdminPage: getAdminPage,
    postPO,
    postInvoice
}