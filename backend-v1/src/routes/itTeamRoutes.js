const express = require("express");
// const {getItTeamPage, createItem, getAllItems, getItem, updateItem, deleteItem} = require('../controllers/itTeamPageController');
const itTeamPageController = require("../controllers/itTeamPageController");

const {
  createItem,
  getAllItems,
  getItem,
  deleteItems,
  getAllItemsForVendor,
} = require("../controllers/itTeamPage/itemController");
const {
  createVendor,
  getAllVendors,
  getVendor,
  updateVendor,
  deleteVendor,
} = require("../controllers/itTeamPage/vendorController");

const multer = require("multer");
// init all web routes
let router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./src/public");
  },
  filename: function (req, file, cb) {
    return cb(null, `${file.originalname}`);
  },
});

const upload = multer({ storage });

let initAllItTeamRoutes = (app) => {
  // request route
  router.get("/request/:doc/:rqid", itTeamPageController.getFile);

  router.get("/request/track", itTeamPageController.trackRequest);
  router.post("/request/create", itTeamPageController.createRequest);
  router.patch(
    "/request/update",
    upload.single("quote"),
    itTeamPageController.updateRequest
  );
  router.get("/request/history", itTeamPageController.trackHistory);
  router.delete("/request/:id", itTeamPageController.deleteRequest);

  // item routes
  router.post("/it/items", createItem);
  router.get("/it/items", getAllItemsForVendor);
  router.get("/it/items1", getAllItems);
  router.get("/it/items/:id", getItem);
  router.delete("/it/items/:id", deleteItems);

  // vendor routes
  router.post("/it/vendors", createVendor);
  router.get("/it/vendors", getAllVendors);
  router.get("/it/vendors/:id", getVendor);
  router.patch("/it/vendors/:id", updateVendor);
  router.delete("/it/vendors/:id", deleteVendor);

  return app.use("/", router);
};

module.exports = initAllItTeamRoutes;
