const axios = require('axios')
const rateLimit = require('axios-rate-limit')
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 60000 })

const {
  ALPHA_VANTAGE_BASE_URL,
  ALPHA_VANTAGE_API_KEY
} = process.env

module.exports = {
  getDailyPrices,
  getGlobalQuote
}
async function getDailyPrices (symbol) {
  // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=MSFT&outputsize=full&apikey=demo
  // https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo
  const req = await http.get(`${ALPHA_VANTAGE_BASE_URL}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
  const { data } = req
  const timeSeries = data['Time Series (Daily)']
  const firstKey = Object.keys(timeSeries)[0]
  const lastTradingDay = timeSeries[firstKey]
}

async function getGlobalQuote (symbol) {
  const req = await http.get(`${ALPHA_VANTAGE_BASE_URL}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`)
  const { data } = req
  return data['Global Quote']['05. price']
}
