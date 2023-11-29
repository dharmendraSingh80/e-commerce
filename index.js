import express from "express";
import swagger from "swagger-ui-express";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";

import apiDocs from "./swagger.json" assert { type: "json" };

//create server
const app = express();

app.use(express.json());

//for all reqests related to product, redirect to product routes.
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
app.use("/api/products", jwtAuth, productRouter);
app.use("/api/cartItems", jwtAuth, cartRouter);
app.use("/api/users", userRouter);

//default request handler
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

//specify port
app.listen(3200, () => {
  console.log("Server is running at 3200");
});
