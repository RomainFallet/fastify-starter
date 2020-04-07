require('dotenv-flow').config()
const mongoose = require('mongoose')
const app = require('./app')

const start = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    // Start the webserver
    await app.listen(3000)

    app.log.info(`server listening on ${app.server.address().port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
