const jwt = require("jsonwebtoken");
const { SECRET } = require("./config.js");
const User = require("../models/user.js");

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
      console.log("session", req.session, req.decodedToken);
      if (
        !req.session?.userId ||
        req.session?.token !== authorization.substring(7)
      ) {
        return res.status(401).json({ error: "token invalid" });
      }
      const user = await User.findByPk(req.decodedToken.id, {
        attributes: ["disabled"],
      });
      if (user.disabled) {
        console.log("reqFcTZ50AY4X4sJ9", req.session);

        return req.session.destroy(() => {
          return res
            .status(401)
            .json({ error: "account disabled, please contact admin" });
        });
      }
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

module.exports = { tokenExtractor };
