const express = require("express");
const router = express.Router();

const adressRoute = require("./adressRoute");
const autRoute = require("./authRoutes");
const productRoute = require("./productRoute");
const categoryRoute = require("./categoryRoute");

router.use("/adress",adressRoute);
router.use("/auth",autRoute);
router.use("/product",productRoute);
router.use("/categories",categoryRoute);

module.exports = router;