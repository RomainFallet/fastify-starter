const app = require('fastify')()
const { setupMongo, cleanMongo } = require('../helpers/test-utils')
const Cat = require('../models/cat')
const mongoose = require('mongoose')

describe('/cats', () => {
  let mongoServer
  beforeAll(async () => {
    app.register(require('./cats'))
    mongoServer = await setupMongo()
  })

  afterAll(async () => {
    await cleanMongo(mongoServer)
    await app.close()
  })

  describe('GET /cats', () => {
    it('responds 200 and return cats', async () => {
      // Arrange
      expect.assertions(2)
      await Cat.remove({})
      await Cat.create({ name: 'Meow', color: 'dark' })

      // Act
      const res = await app.inject({
        method: 'GET',
        url: '/cats'
      })

      // Assert
      expect(res.statusCode).toBe(200)
      expect(res.json()).toStrictEqual([
        {
          _id: expect.any(String),
          __v: 0,
          name: 'Meow',
          color: 'dark'
        }
      ])
    })
  })

  describe('POST /cats', () => {
    it('responds 204 and save cat', async () => {
      // Arrange
      expect.assertions(3)
      await Cat.remove({})

      // Act
      const res = await app.inject({
        method: 'POST',
        url: '/cats',
        body: { name: 'Meow', color: 'dark' }
      })

      // Assert
      expect(res.statusCode).toBe(204)
      expect(res.body).toBe('')
      expect((await Cat.findOne({ name: 'Meow' })).toObject()).toStrictEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        __v: 0,
        color: 'dark',
        name: 'Meow'
      })
    })
  })
})
