const schedule = require('node-schedule')
const duda = require('./duda')

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
