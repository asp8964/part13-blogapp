const express = require('express')
const app = express()

const { PORT } = require('./util/config')

const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

const errorHandler = (error, _, response, next) => {
  console.error(JSON.stringify(error))

  if (error.name === 'SequelizeValidationError') {
    const msgs = error?.errors?.map(e => e.message)
    return response.status(400).send({ error: msgs })
  }

  next(error)
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
