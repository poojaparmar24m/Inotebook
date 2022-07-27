require("dotenv").config();
const jwt = require("jsonwebtoken");

const fetchUser = (req, res, next) => {
  // get the user from the jwt token and add id to req object

  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(data);
    req.user = data.user;
    // console.log(data.user);
    next();
  } catch (error) {
    return res.status(500).send({ error: "internal server error" });
  }
};

module.exports = fetchUser;
