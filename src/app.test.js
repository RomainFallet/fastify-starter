const fastify = require('./app')

describe('GET /', () => {
  it('responds 200 with hello world', async () => {
    const res = await fastify.inject({
      method: 'GET',
      url: '/'
    })

    expect(res.statusCode).toBe(200)
    expect(res.json()).toEqual({
      hello: 'world'
    })
  })
})
