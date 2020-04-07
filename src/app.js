// Require the framework and instantiate it
const app = require('fastify')({
  logger: process.env.NODE_ENV === 'prod '
})

// Declare a route
app.get('/', async (request, res) => {
  return { hello: 'world' }
})

module.exports = app
