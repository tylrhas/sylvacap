const { INTEGER, STRING, DATE, REAL } = require('sequelize')
const alpha = require('../controllers/alphaVantage')
const hooks = require('../controllers/modelHooks')
module.exports = sequelize => sequelize.define('stock', {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: INTEGER
  },
  dudaRowId: {
    type: STRING
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
  purchasePrice: {
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
    },
    beforeDestroy: (stock, options) => {
      const { dudaRowId } = stock.dataValues
      if (dudaRowId) {
        hooks.removeStock([dudaRowId])
      }
    }
  }
}
)
