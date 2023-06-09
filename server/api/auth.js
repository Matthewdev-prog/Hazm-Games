const express = require("express");
const router = express.Router();
const { getUserByUserName, createUser, updateUser } = require("../db/User");
const { authenticate, getUserByToken } = require("../db");
const { getAllCartsByUserId } = require("../db/cart");

module.exports = router;
// current location is api/auth
router.post("/", async (req, res, next) => {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  } catch (ex) {
    next(ex);
  }
});

router.patch("/user", async (req, res, next) => {
  try {
    //const token = await authenticate(req.body);
    const updatedUser = await updateUser(req.body);
    res.send(updatedUser);
  } catch (ex) {
    next(ex);
  }
});

router.get("/user/carts", async (req, res, next) => {
  try {
    const user = await getUserByToken(req.headers.authorization);
    const carts = await getAllCartsByUserId({userId: user.id });
    res.send(carts);
  } catch (ex) {
    next(ex);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const _user = await getUserByUserName({ username });
    if (_user) {
      res.send({
        error: "Username Taken",
        message:
          "User ${username} is already taken. Please login or try a different username.",
        name: "Username Taken",
      });
      return;
    }

    if (password.length < 8) {
      res.send({
        error: "Password Too Short!",
        message: "Password is too short must have at least 8 character",
        name: "Password Too Short!",
      });
      return;
    }

    await createUser(req.body);

    const token = await authenticate(req.body);
    res.send({ token });
  } catch (error) {
    next(error);
  }
});

//check if user exists. If so, send an error message
// otherwise, create a new user with the createUser function (from ../db/User.js)
// after creating a user, create a token with jwt.sign()
// send the token back to the client

router.get("/", async (req, res, next) => {
  try {
    res.send(await getUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});
