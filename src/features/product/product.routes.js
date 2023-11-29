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

productRouter.post("/rate", productController.rateProduct);

productRouter.get("/filter", productController.filterProducts);

productRouter.get("/", productController.getAllProducts);
productRouter.post(
  "/",
  upload.single("imageUrl"),
  productController.addProduct
);
productRouter.get("/:id", productController.getOneProduct);

export default productRouter;
