const router = require("express").Router();

const jwt = require("jsonwebtoken");
const { Blog, User } = require("../models");
const { SECRET } = require("../util/config");
const { Op } = require("sequelize");
const { tokenExtractor } = require("../util/middleware");

const blogFinder = async (req, _, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

router.get("/", async (req, res) => {
  const where = {};

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ];
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      // attributes: ['name']
    },
    order: [["likes", "DESC"]],
    where,
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, async (req, res, next) => {
  // try {
  //   const blog = await Blog.create(req.body)
  //   return res.json(blog)
  // } catch (error) {
  //   return res.status(400).json({ error })
  // }
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.delete("/:id", blogFinder, tokenExtractor, async (req, res) => {
  // console.log(req.decodedToken.id === req.blog.userId);

  if (req.blog && req.decodedToken.id === req.blog.userId) {
    await req.blog.destroy();
    return res.status(204).end();
  }
  res.status(404).end();
  // const result = await Blog.destroy({
  //   where: {
  //     id: {
  //       [Op.eq]: req.params.id
  //     }
  //   }
  // })
  // res.json(result)
});

router.put("/:id", blogFinder, async (req, res, next) => {
  if (req.blog && req.body.likes >= 0) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else if (req.body.likes < 0) {
    next(new Error("likes can't be negative"));
    // return res.status(400).json({error: "likes can't be negative"})
  } else {
    res.status(404).end();
  }
});

module.exports = router;
