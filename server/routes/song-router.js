const express = require("express");
const router = express.Router();
const StoreController = require("../controllers/store-controller");


router.get("/all", StoreController.getAllSongs);

module.exports = router;
