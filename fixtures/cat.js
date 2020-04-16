/* eslint-env mongo */
// eslint-disable-next-line no-global-assign
ObjectId =
  typeof ObjectId !== 'undefined'
    ? ObjectId
    : require('mongoose').Types.ObjectId

const cat = {
  _id: ObjectId('5e980b9bafdcc9eda8df1ffc'),
  __v: 0,
  name: 'Kitty',
  color: 'brown',
  createdAt: new Date('2020-04-16T08:57:33.198Z'),
  updatedAt: new Date('2020-04-16T08:57:33.198Z')
}

if (typeof db !== 'undefined') {
  db.cats.remove({})
  db.cats.insert(cat)
}

module.exports = cat
