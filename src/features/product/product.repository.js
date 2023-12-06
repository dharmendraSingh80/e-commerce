import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class ProductRepository {
  constructor() {
    this.collection = "products";
  }
  async add(newProduct) {
    try {
      // get the db
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.insertOne(newProduct);
      return newProduct;
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.find().toArray();
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async filter(minPrice, maxPrice, category) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }
      if (maxPrice) {
        filterExpression.price = {
          ...filterExpression.price,
          $lte: parseFloat(maxPrice),
        };
      }

      if (category) {
        filterExpression.category = category;
      }
      return await collection.find(filterExpression).toArray();
    } catch (error) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
  async rate(userID, productID, rating) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      await collection.updateOne(
        {
          _id: new ObjectId(productID),
        },
        { $push: { ratings: { userID: new ObjectId(userID), rating } } }
      );
    } catch (error) {
      console.log(error);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}