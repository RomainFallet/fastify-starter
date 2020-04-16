const fastify = require('fastify')
const { setupMongo, cleanMongo } = require('../helpers/test-utils')
const Cat = require('../models/cat')
const mongoose = require('mongoose')
const catsRoute = require('./cats')
const cat = require('./../../fixtures/cat')

describe('/cats', () => {
  describe('GET /cats', () => {
    it('responds 200 and return cats', async () => {
      // Arrange
      expect.assertions(2)
      const app = fastify().register(catsRoute)
      const { mongoServer, connection } = await setupMongo()
      await Cat.create(cat)

      // Act
      const res = await app.inject({
        method: 'GET',
        url: '/cats'
      })

      // Clean up
      await cleanMongo({ mongoServer, connection })

      // Assert
      expect(res.statusCode).toBe(200)
      expect(res.json()).toStrictEqual([
        {
          _id: cat._id.toString(),
          __v: cat.__v,
          name: cat.name,
          color: cat.color,
          createdAt: cat.createdAt.toISOString(),
          updatedAt: cat.updatedAt.toISOString()
        }
      ])
    })
  })

  describe('POST /cats', () => {
    it('responds 204 and save cat', async () => {
      // Arrange
      expect.assertions(3)
      const app = fastify().register(catsRoute)
      const { mongoServer, connection } = await setupMongo()

      // Act
      const res = await app.inject({
        method: 'POST',
        url: '/cats',
        body: { name: 'Meow', color: 'dark' }
      })
      const savedCat = (await Cat.findOne({ name: 'Meow' })).toObject()

      // Clean up
      await cleanMongo({ mongoServer, connection })

      // Assert
      expect(res.statusCode).toBe(204)
      expect(res.body).toBe('')
      expect(savedCat).toStrictEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        __v: 0,
        color: 'dark',
        name: 'Meow',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })
  })
})
