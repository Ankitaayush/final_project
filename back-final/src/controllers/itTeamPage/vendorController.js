const connection = require('../../config/db');

const createVendor =  (req, res) => {
  const { vendor_name, email, contact_person, phone, itid } = req.body;
  const query_1 = 'INSERT INTO vendors VALUES (NULL, ?, ?, ?, ?, NOW(), NOW())';

  connection.query(query_1, [vendor_name, email, contact_person, phone], (err, result) => {
    if (err) {
      return res.status(500).json({
        status: 'failure',
        err
      })
    }

    const vid = result.insertId;

    const query_3 = 'INSERT INTO itemvendormaps VALUES(NULL, NOW(), NOW(), ?, ?)'
   
    itid.forEach(id => {
        connection.query(query_3, [id, vid], (err, newRes) => {
            if (err) {
                return res.status(500).json({
                status: 'failure',
                err
                })
            }
        })
    });

    res.status(201).json({
        status: 'success',
    })
  })
};

 
 
const getAllVendors = (req, res) => {
    const sql = `SELECT t1.vid, t1.vendor_name, t1.email, t1.contact_person, t1.phone_no, JSON_ARRAYAGG(t3.item_name) AS item_names
                 FROM vendors t1
                 JOIN itemvendormaps t2 ON t1.vid = t2.vid
                 JOIN items t3 ON t2.itid = t3.itid
                 GROUP BY t1.vid;`;

    connection.query(sql, (err, result) => {
        if(err) {
            return res.status(500).json({
                status: 'failure',
                err
            })
        }

        if(res.affectedRows === 0) {
            return res.status(404).json({
                status: 'failure',
                err
            })
        }

        return res.status(200).json({
            status: 'success',
            result
        })
    })
}

const getVendor = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT t1.vid, t1.vendor_name, t1.email, t1.contact_person, t1.phone_no, JSON_ARRAYAGG(t3.item_name) AS item_names
                 FROM vendors t1
                 JOIN itemvendormaps t2 ON t1.vid = t2.vid
                 JOIN items t3 ON t2.itid = t3.itid
                 GROUP BY t1.vid HAVING t1.vid = ?`;

    connection.query(sql, [id], (err, result) => {
        if(err) {
            return res.status(500).json({
                status: 'failure',
                err
            })
        }

        if(result.length === 0) {
            return res.status(404).json({
                status: 'failure',
                err: 'Resource Not Found!'
            })
        }

        return res.status(200).json({
            status: 'success',
            result
        })
    })
}

const updateVendor = (req, res) => {
    const id = req.params.id;
    const {vendor_name, email, contact_person, phone, itid} = req.body;

    const sql = 'UPDATE vendors SET vendor_name = ?, email = ?, contact_person = ?, phone_no = ? WHERE vid = ?';

    connection.query(sql, [vendor_name, email, contact_person, phone, id], (err, result) => {
        if(err) {
            return res.status(500).json({
                status: 'Failure',
                err
            })
        }

        if(result.affectedRows === 0) {
            return res.status(400).json({
                status: 'Failure',
                err: 'Bad Request'
            })
        }

        const deleteSql = 'DELETE FROM itemvendormaps WHERE vid = ?';

        connection.query(deleteSql, [id], (err, result) => {
            if(err) {
                return res.status(500).json({
                    status: 'Failure',
                    err
                })
            }

            const insertSql = 'INSERT INTO itemvendormaps VALUES (NULL, NOW(), NOW(), ?, ?)';

            const promises = itid.map(ids => {
                return new Promise((resolve, reject) => {
                    connection.query(insertSql, [ids, id], (err, result) => {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    })
                })
            })

            Promise.all(promises)
                .then(() => {
                    return res.status(201).json({
                        status: 'success'
                    })
                })
                .catch((err) => {
                    return res.status(500).json({
                        status: 'Failure',
                        err
                    })
                })
        })
    })
}

const deleteVendor = (req, res) => {
    const id = req.params.id;

    const deleteMapQuery = 'DELETE FROM itemvendormaps WHERE vid = ?'

        connection.query(deleteMapQuery, [id], (err, result) => {
            if(err) {
                return res.status(500).json({
                    status: 'Failure',
                    err
                })
            }

            if(result.affectedRows === 0) {
                return res.status(404).json({
                    status: 'Failure',
                    err: 'Resource Not Found!'
                })
            }
        })

    const deleteQuery = 'DELETE FROM Vendors WHERE vid = ?';

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
    createVendor,
    getAllVendors,
    getVendor,
    updateVendor,
    deleteVendor
}