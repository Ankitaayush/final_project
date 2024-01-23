const express = require("express");
const managerPageController = require("../controllers/managerPageController");
const loginPageController = require("../controllers/loginPageController");

// init all web routes
let router = express.Router();

let initAllManagerRoutes = (app) => {
  router.get(
    "/manager",

    loginPageController.protect,
    managerPageController.getManagerPage
  );

  //  router.get('/request/manager/:id', managerPageController.getQuotation)
  router.patch("/request/manager/:id", managerPageController.updateStatus);
  return app.use("/", router);
};

module.exports = initAllManagerRoutes;
