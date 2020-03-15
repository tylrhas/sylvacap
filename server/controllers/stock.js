const moment = require('moment')
const models = require('../models')
const alpha = require('./alphaVantage')
module.exports = {
  create,
  getAll,
  update,
  destroy
}
function getAll () {
  // Remove Timestamps from dates
  return models.stock.findAll()
    .then(stocks => stocks.map((stock) => {
      const data = {
        id: stock.dataValues.id,
        name: stock.dataValues.name,
        symbol: stock.dataValues.symbol,
        datePurchased: moment(stock.dataValues.datePurchased).format('MM/DD/YYYY'),
        purchasePrice: stock.dataValues.purchasePrice,
        dateSold: '',
        soldPrice: '',
        currentPrice: stock.dataValues.currentPrice
      }
      if (stock.dataValues.dateSold) {
        data.dateSold = moment(stock.dataValues.dateSold).format('MM/DD/YYYY')
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
function update (data) {
  const update = {
    name: data.name,
    symbol: data.symbol,
    datePurchased: null,
    purchasePrice: null,
    dateSold: null,
    soldPrice: null
  }
  if (data.purchasePrice !== '') {
    update.purchasePrice = data.purchasePrice
  }
  if (data.soldPrice !== '') {
    update.soldPrice = data.soldPrice
  }
  if (data.datePurchased !== '') {
    update.datePurchased = moment(data.datePurchased).format()
  }
  if (data.dateSold !== '') {
    update.dateSold = moment(data.dateSold).format()
  }
  return models.stock.update(update, {
    where: {
      id: data.id
    }
  })
}

function destroy (id) {
  return models.stock.destroy({
    where: {
      id
    }
  })
}
