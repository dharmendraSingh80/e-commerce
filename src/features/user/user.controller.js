import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
export default class UserController {
  signUp(req, res) {
    const { name, email, password, type } = req.body;
    const user = UserModel.signUp(name, email, password, type);
    res.status(201).send(user);
  }
  signIn(req, res) {
    const result = UserModel.signIn(req.body.email, req.body.password);

    if (!result) {
      return res.status(400).send("Incorrect Credentials");
    } else {
      // create token
      const token = jwt.sign(
        { userID: result.id, email: result.email },
        ".N-YDgY=SkgJL2E",
        { expiresIn: "1h" }
      );

      // Send token
      return res.status(200).send(token);
    }
  }
}
