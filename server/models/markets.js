const { INTEGER, STRING, DATE, REAL } = require('sequelize')
const alpha = require('../controllers/alphaVantage')
const hooks = require('../controllers/modelHooks')
module.exports = sequelize => sequelize.define('market', {
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
  year: {
    type: STRING
  },
  purchasePrice: {
    type: REAL
  },
  currentPrice: {
    type: REAL
  },
  soldPrice: {
    type: REAL
  },
  change: {
    type: REAL
  }
},
{
  // hooks: {
  //   afterCreate: (stock, options) => {
  //     if (!stock.dataValues.dateSold) {
  //       alpha.getGlobalQuote(stock.dataValues.symbol)
  //         .then(currentPrice => stock.update({ currentPrice }))
  //     }
  //   },
  //   beforeDestroy: (stock, options) => {
  //     const { dudaRowId } = stock.dataValues
  //     if (dudaRowId) {
  //       hooks.removeStock([dudaRowId])
  //     }
  //   }
  // }
}
)
