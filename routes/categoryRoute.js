const express = require("express");
const router = express.Router();

const {authenticationToken,checkAdmin} = require("../middlewares/checkAuth");
const categoryController = require("../controllers/categoryController");
const pageController = require("../controllers/pageController");

router.get("/",authenticationToken,checkAdmin, pageController.getCategoriesPage);
router.post("/",authenticationToken,checkAdmin, categoryController.postCategories);
router.delete("/:id",authenticationToken,checkAdmin, categoryController.deleteCategories);
router.put("/:id",authenticationToken,checkAdmin, categoryController.editCategories);

module.exports = router;