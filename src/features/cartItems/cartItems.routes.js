import express from "express";
import CartItemsController from "./cartItems.controller.js";

//initialize express router
const cartRouter = express.Router();

const cartController = new CartItemsController();
cartRouter.delete("/:id", cartController.delete);
cartRouter.post("/", cartController.add);
cartRouter.get("/", cartController.get);

export default cartRouter;
