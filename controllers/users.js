const router = require("express").Router();

const { User, Blog } = require("../models");

router.get("/", async (_, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  // try {
  //   const user = await User.create(req.body)
  //   res.json(user)
  // } catch (error) {
  //   console.log(Array.isArray(error.errors));
  //   console.log(error);
  //   return res.status(400).json({ error })
  // }
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", async (req, res, next) => {
  const user = await User.findOne({
    where: { username: req.params.username },
  });
  if (!user) {
    return res.status(404).end();
  }
  user.username = req.body.username;
  await user.save();
  res.json(user);
});

router.get("/:id", async (req, res) => {
  const isRead = {};
  if (req.query.read) {
    isRead.read = req.query.read === "true";
  }
  const user = await User.findOne({
    where: {
      id: req.params.id,
    },
    attributes: { exclude: ["id", "createdAt", "updatedAt"] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["createdAt", "updatedAt", "userId"] },
        through: {
          where: isRead,
          attributes: ["id", "read"],
        },
      },
    ],
  });
  res.json(user);
});

module.exports = router;
