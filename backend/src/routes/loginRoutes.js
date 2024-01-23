const express = require("express");
const loginPageController = require("../controllers/loginPageController");

// init all web routes
let router = express.Router();

let initAllLoginRoutes = (app) => {
  router.get("/login", loginPageController.getLoginPage);

  router.get("/logout", loginPageController.getLogout);
  router.get("/checkuser/:expectedRole", loginPageController.checkuserrole2);
  //  console.log('ho')
  router.post("/login", loginPageController.postLogin);
  router.get("/protect", loginPageController.protect);
  return app.use("/", router);
};

module.exports = initAllLoginRoutes;
