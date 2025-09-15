const jwt = require("jsonwebtoken");
const router = require("express").Router();

const { SECRET } = require("../util/config");
const User = require("../models/user");
const { tokenExtractor } = require("../util/middleware");

router.post("/login", async (request, response, next) => {
  const body = request.body;

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  });

  const passwordCorrect = body.password === "secret";

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  if (user.disabled) {
    return response.status(401).json({
      error: "account disabled, please contact admin",
    });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, SECRET);
  request.session.userId = user.id;
  request.session.token = token;

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

router.delete("/logout", tokenExtractor, async (req, res) => {
  // req.session.userId = null;
  // req.session.token = null;
  req.session.destroy((err) => {
    console.log(err);

    return res.json({ info: "logout" });
  });
});

module.exports = router;
