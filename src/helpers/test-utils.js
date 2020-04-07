const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

const setupMongo = async () => {
  const mongoServer = new MongoMemoryServer()
  await mongoose.connect(await mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  return mongoServer
}
const cleanMongo = async mongoServer => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

module.exports = { setupMongo, cleanMongo }
