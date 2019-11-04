const models = require('../models')
const alpha = require('./alphaVantage')
module.exports = {
  create,
  getAll
}
function getAll () {
  return models.stock.findAll()
}
function create (data) {
  // create and return the model
  return models.stock.create(data)
}
