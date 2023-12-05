import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

class UserRepository {
  async signUp(newUser) {
    try {
      // get the database
      const db = getDB();

      //get the collection
      const collection = db.collection("users");

      // Insert the document
      await collection.insertOne(newUser);
      return newUser;
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async signIn(email, password) {
    try {
      // get the database
      const db = getDB();

      //get the collection
      const collection = db.collection("users");

      // Find the document
      return await collection.findOne({ email, password });
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async findByEmail(email) {
    try {
      // get the database
      const db = getDB();

      //get the collection
      const collection = db.collection("users");

      // Find the document
      return await collection.findOne({ email});
    } catch (err) {
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }
}

export default UserRepository;
