const connection = require('../../config/db');

const createItem = async (req, res) => {
    const { item_name } = req.body;
    const sql = 'INSERT INTO items VALUES (NULL, ?, NOW(), NOW())';

    connection.query(sql, [item_name], (err, result) => {
        if(err) {
            return res.status(500).json({
                status: 'failure',
                err
            })
        }

        return res.status(201).json({
            status: 'success',
            result
        })
    })
    
}
 
 
const getAllItems = (req, res) => {
    const sql = 'SELECT itid, item_name FROM items';

    connection.query(sql, (err, result) => {
        if(err) {
            res.status(500).json({
                status: 'failure',
                err
            })
        }

        if(res.affectedRows === 0) {
            res.status(404).json({
                status: 'failure',
                err
            })
        }

        const data = [{}];


        for(let i=1; i<result.length; i++) {
        
            data.push({
                "id": result[i].itid,
                "name": result[i].item_name
            })
        }

        console.log(data)

        res.status(200).json({
            status: 'success',
            data
        })
    })
}

const getItem =  (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT itid, item_name FROM items WHERE itid = ?';

     connection.query(sql, [id], (err, result) => {
        if(err) {
            res.status(500).json({
                status: 'Failure',
                err
            })
        }

        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'Failure',
                err: 'Resource Not Found!!'
            })
        }

        return res.status(200).json({
            status: 'success',
            result
        })
    })
}

const deleteItems = (req, res) => {
    const id = req.params.id;

    const deleteQuery = 'DELETE FROM items WHERE itid = ?';

    connection.query(deleteQuery, [id], (err, result) => {
        if(err) {
            return res.status(500).json({
                status: 'Failure',
                err
            })
        }

        if(result.affectedRows === 0) {
            return res.status(404).json({
                status: 'failure',
                err: 'Resource Not Found!!'
            })
        }

        return res.status(204).json({
                sttaus: 'Success'
        })
    })
}


module.exports = {
    createItem,
    getAllItems,
    getItem,
    deleteItems
}