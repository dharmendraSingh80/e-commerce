//manage routes/path to ProductController

import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middlewares/fileupload.middleware.js";

//initialize express router
const productRouter = express.Router();

const productController = new ProductController();
//all the paths to controller methods

//query param
// localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=category1

productRouter.post("/rate", (req, res, next) => {
  productController.rateProduct(req, res, next);
});

productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});

productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
