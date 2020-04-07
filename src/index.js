require('dotenv-flow').config()
const mongoose = require('mongoose')
const app = require('fastify')({
  logger: true
})

const start = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // Register routes
    app.register(require('./routes/cats'))

    // Start the webserver
    await app.listen(3000)

    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
