const express = require("express");
const adminPageController = require("../controllers/adminPageController");
const multer = require("multer");
const loginPageController = require("../controllers/loginPageController");
// init all web routes
let router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./src/public");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

let initAllAdminRoutes = (app) => {
  router.post(
    "/admin/upload",
    upload.single("file"),
    adminPageController.uploadPo
  );
  router.get(
    "/admin/getFile/:id",

    adminPageController.openPo
  );
  router.get(
    "/admin",

    adminPageController.getAdminPage
  );

  router.post(
    "/admin/PO/:id",

    adminPageController.postPO
  );
  router.post(
    "/admin/invoice/:id",

    adminPageController.postInvoice
  );
  return app.use("/", router);
};

module.exports = initAllAdminRoutes;
