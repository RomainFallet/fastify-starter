/* eslint-env mongo */
db.cats.remove({})
db.cats.insert({
  name: 'Kitty',
  color: 'brown'
})
