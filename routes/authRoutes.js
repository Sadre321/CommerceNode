const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");
const productController = require("../controllers/productController");
const pageController = require("../controllers/pageController");

const {authenticationToken,checkAdmin} = require("../middlewares/checkAuth");

router.get("/login",pageController.getLoginPage);
router.get("/register",pageController.getRegisterPage);

router.get("/settings",authenticationToken,pageController.getUserSettingsPage);
router.post("/save", authenticationToken, authController.changeUserDetail);

router.get("/market",authenticationToken, pageController.getUserMarketPage);
router.post("/payment",authenticationToken, cartController.payment);
router.get("/payment-intents",authenticationToken,checkAdmin,cartController.paymentList)

router.get("/users",authenticationToken,checkAdmin, pageController.getUsersPage);



router.post("/addCart",authenticationToken,cartController.postCart);
router.delete("/removeCart/:id",authenticationToken,cartController.removeCart);
router.post("/addFavorite",authenticationToken,cartController.postFavorite);
router.post("/removeFavorite",authenticationToken,cartController.removeFavorite);

router.get("/orders",authenticationToken,checkAdmin, pageController.getOrdersPage);

router.post("/register",authController.postRegister);
router.post("/login",authController.postLogin);
router.post("/logout",authController.postLogout);
router.delete("/deleteUser",authController.deleteUser);

module.exports = router;