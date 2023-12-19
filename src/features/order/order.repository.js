import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class OrderRepository {
  constructor() {
    this.collection = "orders";
  }

  async placeOrder(userId) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();
      // get cartitems and calculate total amount
      const items = await this.getTotalAmount(userId, session);
      const finalTotalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0
      );
      // console.log(finalTotalAmount);

      //create an order record
      const newOrder = new OrderModel(
        new ObjectId(userId),
        finalTotalAmount,
        new Date()
      );
      await db.collection(this.collection).insertOne(newOrder, { session });

      //reduce the stock
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      //  throw new Error("Something is wrong in place order");

      //clear the cart items
      await db.collection("cartItems").deleteMany(
        {
          userID: new ObjectId(userId),
        },
        { session }
      );
      session.commitTransaction();
      session.endSession();
      return;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getTotalAmount(userId, session) {
    const db = getDB();
    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // Get cart items for the user
          {
            $match: { userID: new ObjectId(userId) },
          },
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },

          //unwind the productInfo
          {
            $unwind: "$productInfo",
          },
          //calculate totalAmount for each cartItems
          {
            $addFields: {
              totalAmount: {
                $multiply: ["$productInfo.price", "$quantity"],
              },
            },
          },
        ],
        { session }
      )
      .toArray();
    return items;
  }
}
