const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

const setupMongo = async () => {
  const mongoServer = new MongoMemoryServer()
  const connection = await mongoose.connect(await mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 100
  })
  return { mongoServer, connection }
}
const cleanMongo = async ({ mongoServer, connection }) => {
  await mongoServer.stop()
  await connection.disconnect()
}

module.exports = { setupMongo, cleanMongo }
