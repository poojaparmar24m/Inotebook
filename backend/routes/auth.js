require("dotenv").config();
const express = require("express");
const User = require("../modals/Users");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");
// Route 1: create a user using :POST "/api/auth/createUser".
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "password must be atLeast  5 ").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
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
        success = false;
        return res
          .status(400)
          .json({
            success,
            error: "sorry a user with this email already exists",
          });
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

      const auth_token = jwt.sign(data, process.env.JWT_SECRET_KEY);
      success = true;
      res.json({ success, auth_token });
      // .then((user) => res.json(user))
      // .catch((err) => res.json({ message: err.message }));
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Route 2:Authenticate a user using :POST "/api/auth/login".

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "password cannot be blank ").exists(),
  ],
  async (req, res) => {
    let success = false;
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
        success = false;
        return res.status(400).json({
          success,
          error: "please try to login with correct credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: "please try to login with correct credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(data, process.env.JWT_SECRET_KEY);

      success = true;
      res.json({ success, auth_token });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3 :get logged-in  a user details  using :POST "/api/auth/getUser". login required.
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
