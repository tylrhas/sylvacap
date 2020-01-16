const models = require('../models')
const { Sequelize } = models
const { Op } = Sequelize
const moment = require('moment')

const axios = require('axios')
const rateLimit = require('axios-rate-limit')
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 })
const alpha = require('./alphaVantage')
const {
  DUDA_BASE_URL,
  DUDA_SITE_ID,
  DUDA_STOCK_COLLECTION_NAME,
  DUDA_AUTH_HEADER
} = process.env
module.exports = {
  updateCurrentPrices,
  getNewStocks,
  updateCurrentStocks
}
async function getNewStocks () {
  const stocks = await models.stock.findAll({
    where: {
      dudaRowId: null
    }
  })
  const rows = stocks.map((stock) => {
    const data = {
      // id: stock.dataValues.dudaRowId,
      data: {
        'Company Name': stock.dataValues.name,
        'Ticker Symbol': stock.dataValues.symbol,
        'Date Purchased': moment(stock.dataValues.datePurchased).calendar(),
        'Purchase Price': stock.dataValues.purchasePrice,
        'Date Sold': '',
        'Sold Price': '',
        'Current Price': stock.dataValues.currentPrice
      }
    }
    if (stock.dataValues.dateSold) {
      data.data['Date Sold'] = moment(stock.dataValues.dateSold).calendar()
      data.data['Sold Price'] = stock.dataValues.soldPrice
    }
    return data
  })
  if (rows.length > 0) {
    const { data } = await sendNewRows(rows)
    for (let i = 0; i < data.length; i++) {
      await stocks[i].update({ dudaRowId: data[i].id })
    }
  }
}

async function updateCurrentPrices () {
  const updates = await getUpdates()
  return sendUpdates(updates)
}
function getUpdates () {
  const lastRun = moment.utc().subtract(5, 'hours')
  const now = moment.utc()
  return models.stock.findAll({
    where: {
      updatedAt: {
        [Op.gte]: lastRun
      },
      dudaRowId: {
        [Op.not]: null
      }
    }
  })
    .then(stocks => stocks.map((stock) => {
      const data = {
        id: stock.dataValues.dudaRowId,
        data: {
          'Company Name': stock.dataValues.name,
          'Ticker Symbol': stock.dataValues.symbol,
          'Date Purchased': moment(stock.dataValues.datePurchased).calendar(),
          'Purchase Price': stock.dataValues.purchasePrice,
          'Date Sold': '',
          'Sold Price': '',
          'Current Price': stock.dataValues.currentPrice
        }
      }
      if (stock.dataValues.dateSold) {
        data.data['Date Sold'] = moment(stock.dataValues.dateSold).calendar()
        data.data['Sold Price'] = stock.dataValues.soldPrice
      }
      return data
    }))
}

function sendUpdates (body) {
  return http.put(`${DUDA_BASE_URL}/${DUDA_SITE_ID}/collection/${DUDA_STOCK_COLLECTION_NAME}/row`, body, { headers: { authorization: DUDA_AUTH_HEADER } })
    .then(() => {
      return publishChanges()
    })
}

function sendNewRows (body) {
  return http.post(`${DUDA_BASE_URL}/${DUDA_SITE_ID}/collection/${DUDA_STOCK_COLLECTION_NAME}/row`, body, { headers: { authorization: DUDA_AUTH_HEADER } })
    .then(async (res) => {
      const { data } = res
      const changes = await publishChanges()
      return { data, changes }
    })
}

async function updateCurrentStocks () {
  console.log({ models })
  const stocks = await models.stock.findAll({
    where: {
      dateSold: null
    }
  })
  for (let i = 0; i < stocks.length; i++) {
    const stock = stocks[i]
    const currentPrice = await alpha.getGlobalQuote(stock.dataValues.symbol)
    stock.update({ currentPrice })
  }
}

function publishChanges () {
  return http.post(`${DUDA_BASE_URL}/${DUDA_SITE_ID}/content/publish`, {}, { headers: { authorization: DUDA_AUTH_HEADER } })
}
