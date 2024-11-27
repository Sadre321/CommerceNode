const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

const {authenticationToken,checkAdmin} = require("../middlewares/checkAuth");
const upload = require("../middlewares/image-uploads");

router.get("/login",authController.getLoginPage);
router.get("/register",authController.getRegisterPage);
router.get("/settings",authenticationToken,authController.getUserSettingsPage);
router.post("/save", authenticationToken, authController.changeUserDetail);
router.get("/market",authenticationToken, authController.getUserMarketPage);
router.get("/users",authenticationToken,checkAdmin, authController.getUsersPage);
router.get("/categories",authenticationToken,checkAdmin, authController.getCategoriesPage);
router.post("/categories",authenticationToken,checkAdmin, authController.postCategories);
router.delete("/categories/:id",authenticationToken,checkAdmin, authController.deleteCategories);
router.put("/categories/:id",authenticationToken,checkAdmin, authController.editCategories);
router.get("/products",authenticationToken,checkAdmin, authController.getProductsPage);
router.post("/addCart",authenticationToken,authController.postCart);
router.delete("/removeCart/:id",authenticationToken,authController.removeCart);
router.post("/addFavorite",authenticationToken,authController.postFavorite);
router.post("/removeFavorite",authenticationToken,authController.removeFavorite);
router.post("/products",authenticationToken,checkAdmin,upload.array("file",5),authController.postProduct);
router.delete("/products/:id",authenticationToken,checkAdmin,authController.deleteProduct);
router.get("/orders",authenticationToken,checkAdmin, authController.getOrdersPage);
router.post("/adress",authenticationToken,authController.postAdress);
router.delete("/adress/:id",authenticationToken,authController.deleteAdress);
router.get("/adress",authenticationToken,authController.getAdresses);
router.post("/register",authController.postRegister);
router.post("/login",authController.postLogin);
router.post("/logout",authController.postLogout);
router.delete("/deleteUser",authController.deleteUser);

module.exports = router;