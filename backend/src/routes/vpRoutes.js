const express = require("express")
const vpPageController = require('../controllers/vpPageController');

// init all web routes
let router = express.Router();

let initAllVpRountes = (app)=>{
    router.get('/vp', vpPageController.getVpPage);
    
    //router.get('/vp/quotation/:id', vpPageController.getQuotation)
    router.post('/vp', vpPageController.updateStatus)
    return app.use('/', router);
}

module.exports = initAllVpRountes;