const schedule = require('node-schedule')
const duda = require('./duda')

schedule.scheduleJob('0 */5 * * *', function () {
  try {
    duda.getNewStocks()
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('0 4 * * *', () => {
  try {
    duda.updateCurrentPrices()
  } catch (error) {
    console.log(error)
  }
})

schedule.scheduleJob('0 */2 * * *', () => {
  try {
    duda.updateCurrentStocks()
  } catch (error) {
    console.log(error)
  }
})
