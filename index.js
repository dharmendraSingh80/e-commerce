import dotenv from "dotenv";
//load all the environment variables in application
dotenv.config();
import express from "express";
import swagger from "swagger-ui-express";
import cors from "cors";

import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
// import basicAuthorizer from "./src/middlewares/basicAuth.middleware.js";
import jwtAuth from "./src/middlewares/jwt.middleware.js";
import cartRouter from "./src/features/cartItems/cartItems.routes.js";

import apiDocs from "./swagger.json" assert { type: "json" };
import loggerMiddleware from "./src/middlewares/logger.middleware.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import likeRouter from "./src/features/like/like.routes.js";

//create server
const app = express();

let corsOptions = {
  origin: "http://localhost:5500",
};
//CORS policy configuration
app.use(cors(corsOptions));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5500");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "*");
//   //return ok for preflight request
//   if (req.method == "OPTIONS") {
//     return res.sendStatus(200);
//   }
//   next();
// });

app.use(express.json());

//for all reqests related to product, redirect to product routes.
app.use("/api-docs", swagger.serve, swagger.setup(apiDocs));
app.use(loggerMiddleware);
app.use("/api/orders", jwtAuth, orderRouter);

app.use("/api/products", jwtAuth, productRouter);
app.use("/api/cartItems", loggerMiddleware, jwtAuth, cartRouter);
app.use("/api/users", userRouter);
app.use("/api/likes", jwtAuth, likeRouter);

//default request handler
app.get("/", (req, res) => {
  res.send("Welcome to Ecommerce APIs");
});

//error handler middleware
app.use((err, req, res, next) => {
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }
  if (err instanceof ApplicationError) {
    return res.status(err.code).send(err.message);
  }

  //server errors
  res.status(500).send("Something went wrong, please try later");
});

// middleware to handle 404 requests
app.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found. Please check our documentation for more information at localhost:3200/api-docs"
    );
});

//specify port
app.listen(3200, () => {
  console.log("Server is running at 3200");
  // connectToMongoDB();
  connectUsingMongoose();
});
