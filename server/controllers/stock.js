const moment = require('moment')
const models = require('../models')
const alpha = require('./alphaVantage')
module.exports = {
  create,
  getAll
}
function getAll () {
  // Remove Timestamps from dates
  return models.stock.findAll()
    .then(stocks => stocks.map((stock) => {
      const data = {
        name: stock.dataValues.name,
        symbol: stock.dataValues.symbol,
        datePurchased: moment(stock.dataValues.datePurchased).calendar(),
        purchasePrice: stock.dataValues.purchasePrice,
        dateSold: '',
        soldPrice: '',
        currentPrice: stock.dataValues.currentPrice
      }
      if (stock.dataValues.dateSold) {
        data.dateSold = moment(stock.dataValues.dateSold).calendar()
        data.soldPrice = stock.dataValues.soldPrice
      }
      return data
    })
    )
}
function create (data) {
  // create and return the model
  return models.stock.create(data)
}
