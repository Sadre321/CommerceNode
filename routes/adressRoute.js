const express = require("express");
const router = express.Router();

const {authenticationToken,checkAdmin} = require("../middlewares/checkAuth");
const addressController = require("../controllers/addressController");

router.post("/",authenticationToken,addressController.postAdress);
router.delete("/:id",authenticationToken,addressController.deleteAdress);
router.get("/",authenticationToken,addressController.getAdresses);

module.exports = router;