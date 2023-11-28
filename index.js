import express from "express";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";

//create server
const app = express();

app.use(express.json());

//for all reqests related to product, redirect to product routes.
app.use("/api/products", jwtAuth, productRouter);
app.use("/api/users", userRouter);

//default request handler
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

//specify port
app.listen(3200, () => {
  console.log("Server is running at 3200");
});
