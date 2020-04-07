const Cat = require('../models/cat')

module.exports = async app => {
  app.get('/cats', async () => {
    const cats = await Cat.find({})
    return cats.map(cat => cat.toJSON())
  })

  app.post('/cats', async (req, res) => {
    await Cat.create(req.body)
    res.status(204)
  })
}
