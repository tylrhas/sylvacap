const schedule = require('node-schedule')
const duda = require('./duda')

schedule.scheduleJob('0 */3 * * *', async function () {
  try {
    await duda.getNewStocks()
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('0 */3 * * *', async () => {
  try {
    await duda.updateCurrentStocks()
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('45 */3 * * *', () => {
  try {
    duda.updateCurrentPrices()
  } catch (error) {
    console.log(error)
  }
})
