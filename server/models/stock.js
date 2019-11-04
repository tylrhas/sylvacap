const { INTEGER, STRING, DATE, REAL } = require('sequelize')
const alpha = require('../controllers/alphaVantage')

module.exports = sequelize => sequelize.define('stock', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER
  },
  dudaRowId: {
    type: INTEGER
  },
  name: {
    type: STRING
  },
  symbol: {
    type: STRING
  },
  datePurchased: {
    type: DATE
  },
  PurchasePrice: {
    type: REAL
  },
  dateSold: {
    type: DATE
  },
  soldPrice: {
    type: REAL
  },
  currentPrice: {
    type: REAL
  }
},
{
  hooks: {
    afterCreate: (stock, options) => {
      if (!stock.dataValues.dateSold) {
        alpha.getGlobalQuote(stock.dataValues.symbol)
          .then(currentPrice => stock.update({ currentPrice }))
      }
    }
  }
}
)
