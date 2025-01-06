const express = require("express");
const router = express.Router();

const {authenticationToken,checkAdmin} = require("../middlewares/checkAuth");
const categoryController = require("../controllers/categoryController");
const pageController = require("../controllers/pageController");

router.get("/categories",authenticationToken,checkAdmin, pageController.getCategoriesPage);
router.post("/categories",authenticationToken,checkAdmin, categoryController.postCategories);
router.delete("/categories/:id",authenticationToken,checkAdmin, categoryController.deleteCategories);
router.put("/categories/:id",authenticationToken,checkAdmin, categoryController.editCategories);

module.exports = router;