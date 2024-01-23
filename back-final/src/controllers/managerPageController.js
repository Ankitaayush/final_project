const connection = require('../config/db')
const path = require('path')

let getManagerPage = (req, res)=>{
    if (req.session.loggedin){
        return res.send({text : `My name is ${req.session.username}`});
    } else {
        return res.redirect('/login')
    }
};

const getQuotation = (req, res) => {
    const id = req.params.id;
    const fileName = path.join(__dirname, '../public/', id + '.pdf');
    res.sendFile(fileName)
}

const updateStatus = async (req, res) => {
    const rqid = req.params.id
    const { action, comment } = req.body;

    const sql = 'UPDATE requeststatuses SET app1 = ?, maanger_comment = ? WHERE rqid = ?'

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
                err: 'Not Found'
            })
        }

        return res.status(201).json({
            status: 'success'
        })
    })
}

module.exports = {
    getManagerPage,
    getQuotation,
    updateStatus
}