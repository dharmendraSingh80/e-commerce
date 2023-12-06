import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async signUp(req, res) {
    const { name, email, password, type } = req.body;

    const hashPassword = await bcrypt.hash(password, 12);
    const user = new UserModel(name, email, hashPassword, type);
    await this.userRepository.signUp(user);
    res.status(201).send(user);
  }
  async signIn(req, res) {
    try {
      //find user by email
      const user = await this.userRepository.findByEmail(req.body.email);

      if (!user) {
        return res.status(400).send("Incorrect Credentials");
      } else {
        //compare password with hashed password
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          // create token
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Send token
          return res.status(200).send(token);
        } else {
          return res.status(400).send("Incorrect Credentials");
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(200).send("Something went wrong");
    }
  }
}
