const schedule = require('node-schedule')
const duda = require('./duda')
const moment = require('moment')
const models = require('../models')
const { Op } = models.sequelize
const alpha = require('./alphaVantage')
schedule.scheduleJob('0 */3 * * *', async function () {
  try {
    console.log('updating new stocks')
    await duda.getNewStocks()
    console.log('new stocks updated')
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('0 */3 * * *', async () => {
  try {
    console.log('updating current stocks')
    await duda.updateCurrentStocks()
    console.log('done updating current stocks')
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('45 */3 * * *', async () => {
  try {
    console.log('updating current prices')
    await duda.updateCurrentPrices()
    console.log('done updating current prices')
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('30 */3 * * *', async () => {
  try {
    console.log('updating current market prices')
    const year = moment().format('YYYY')
    // get markets to be updated
    const markets = await models.market.findAll({ where: { year } })
    const newMarkets = []
    const marketUpdates = []
    for (let i = 0; i < markets.length; i++) {
      const market = markets[i]
      const { symbol } = market.dataValues
      // get price updates from alpha vantage
      const currentPrice = await alpha.getGlobalQuote(symbol)
      await market.update({ currentPrice })
      if (market.dataValues.dudaRowId) {
        marketUpdates.push({
          id: market.dataValues.dudaRowId,
          data: {
            Year: market.dataValues.year,
            Market: market.dataValues.name,
            Change: market.dataValues.Change
          }
        })
      } else {
        newMarkets.push({
          data: {
            Year: market.dataValues.year,
            Market: market.dataValues.name,
            Change: market.dataValues.Change
          }
        })
      }
    }
    if (marketUpdates.length > 0) {
      await duda.sendUpdates(marketUpdates)
    }
    if (newMarkets.length > 0) {
      await duda.sendUpdates(newMarkets)
    }
    console.log('done updating current market prices')
    console.log('Updating Duda Collection')

    console.log('Done Updating Duda Collection')
  } catch (error) {
    console.log(error)
  }
})
