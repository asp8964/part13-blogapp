const ReadingList = require("../models/reading_list");
const { tokenExtractor } = require("../util/middleware");

const router = require("express").Router();

router.post("/", async (req, res) => {
  const readingList = await ReadingList.create(req.body);
  res.json(readingList);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const reading = await ReadingList.findOne({
    where: {
      id: req.params.id,
      userId: req.decodedToken.id,
    },
  });
  if (!reading) {
    return res.status(404).end();
  }
  reading.read = req.body.read;
  reading.save();
  res.json(reading);
});

module.exports = router;
