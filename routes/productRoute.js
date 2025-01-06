const express =require("express");
const router = express.Router();

const {authenticationToken,checkAdmin} = require("../middlewares/checkAuth");
const productController = require("../controllers/productController");

const upload = require("../middlewares/image-uploads");

router.get("/",authenticationToken,checkAdmin, productController.getProductsPage);
router.post("/",authenticationToken,checkAdmin,upload.array("file",5),productController.postProduct);
router.delete("/:id",authenticationToken,checkAdmin,productController.deleteProduct);

module.exports = router;