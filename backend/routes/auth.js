const express = require("express");
const User = require("../modals/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hello";

// create a user using :POST "/api/auth/createUser".
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be atLeast  5 ").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const {
      body: { email, name, password },
    } = req;

    // if there are errors ,return bed request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      user = await User.create({
        name,
        email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      const auth_token = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      res.json({ auth_token });
      // .then((user) => res.json(user))
      // .catch((err) => res.json({ message: err.message }));
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Authenticate a user using :POST "/api/auth/login".

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank ").exists(),
  ],
  async (req, res) => {
    // if there are errors ,return bed request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      body: { email, password },
    } = req;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please try to login with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(data, JWT_SECRET);
      res.json({ auth_token });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
