const express = require("express");
const vpPageController = require("../controllers/vpPageController");
const loginPageController = require("../controllers/loginPageController");
// init all web routes
let router = express.Router();

let initAllVpRountes = (app) => {
  router.get(
    "/vp",

    vpPageController.getVpPage
  );

  //router.get('/vp/quotation/:id', vpPageController.getQuotation)
  router.patch("/request/vp/:id", vpPageController.updateStatus);
  return app.use("/", router);
};

module.exports = initAllVpRountes;
