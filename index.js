const express = require("express");
const app = express();

const { PORT, SSECRET } = require("./util/config");

const { connectToDatabase, sequelize } = require("./util/db");

var session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");
const readingListsRouter = require("./controllers/readingList");

app.use(
  session({
    secret: SSECRET,
    store: new SequelizeStore({
      db: sequelize,
      tableName: "sessions",
    }),
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.use("/api", loginRouter);
app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/readinglists", readingListsRouter);

const errorHandler = (error, req, response, next) => {
  // console.error("esdasd123123sdasd", error, error.message);

  if (error.name === "SequelizeValidationError") {
    const msgs = error?.errors?.map((e) => e.message);
    return response.status(400).send({ error: msgs });
  }

  // next(error);
  return response.status(400).json({ error: error.message });
};

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
