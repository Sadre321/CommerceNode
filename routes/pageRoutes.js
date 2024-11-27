const express  = require("express");
const router = express.Router();

const pageControllers = require("../controllers/pageController");

router.get("/",pageControllers.getHomePage);
router.get("/products/:slug",pageControllers.getProductDetailsPage);

module.exports = router;