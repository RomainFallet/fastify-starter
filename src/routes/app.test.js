const app = require('./app')

describe('action GET /', () => {
  it('responds 200 with hello world', async () => {
    // Arrange
    expect.assertions(2)

    // Act
    const res = await app.inject({
      method: 'GET',
      url: '/'
    })

    // Assert
    expect(res.statusCode).toBe(200)
    expect(res.json()).toStrictEqual({
      hello: 'world'
    })
  })
})
