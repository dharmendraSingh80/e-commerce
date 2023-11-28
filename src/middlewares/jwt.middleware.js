import jwt from "jsonwebtoken";
const jwtAuth = (req, res, next) => {
  // read the token

  const token = req.headers["authorization"];

  //if no token, return the error
  if (!token) {
    return res.status(401).send("Unauthorized");
  }
  //check if token is valid
  try {
    const payload = jwt.verify(token, ".N-YDgY=SkgJL2E");
    console.log(payload);
  } catch (error) {
    //return error
    return res.status(401).send("Unauthorized");
  }

  //call next middleware
  next();
};

export default jwtAuth;
