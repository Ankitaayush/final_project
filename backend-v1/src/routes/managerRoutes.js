const express = require("express")
const managerPageController = require('../controllers/managerPageController');

// init all web routes
let router = express.Router();

let initAllManagerRoutes = (app)=>{
    router.get('/manager', managerPageController.getManagerPage);
    
  //  router.get('/request/manager/:id', managerPageController.getQuotation)
    router.post('/manager', managerPageController.updateStatus)
    return app.use('/', router);
}

module.exports = initAllManagerRoutes;