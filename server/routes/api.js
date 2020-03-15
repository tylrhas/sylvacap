const stock = require('../controllers/stock')
const duda = require('../controllers/duda')
const models = require('../models')
module.exports = (app) => {
  // GET all stocks
  app.get('/api/stocks', async (req, res) => {
    const stocks = await stock.getAll()
    res.json(stocks)
  })
  // add a new stock(s)
  app.post('/api/stocks', async (req, res) => {
    const { body } = req
    const { stocks } = body
    const stocksCreate = []
    for (let i = 0; i < stocks.length; i++) {
      console.log({ stock: stocks[i] })
      try {
        const created = await stock.create(stocks[i])
        stocksCreate.push(created.dataValues)
      } catch (error) {
        console.log(error)
      }
    }
    res.json(stocksCreate)
  })
  app.put('/api/stocks', async (req, res) => {
    try {
      await stock.update(req.body) 
    } catch (error) {
      console.error(error)
    }
    res.sendStatus(200)
  })
  app.delete('/api/stocks/:id', async (req, res) => {
    await stock.destroy(req.params.id)
    res.sendStatus(200)
  })
  app.get('/api/duda/stocks/post', async (req, res) => {
    await duda.getNewStocks()
    res.sendStatus(200)
  })
  app.get('/api/duda/stocks/update', async (req, res) => {
    await duda.updateCurrentPrices()
    res.sendStatus(200)
  })
  app.get('/api/alpha/stocks/update', (req, res) => {
    duda.updateCurrentStocks()
    res.sendStatus(200)
  })

  app.get('/api/markets', async (req, res) => {
    const markets = await models.market.findAll()
    res.json(markets)
  })
  app.post('/api/markets', async (req, res) => {
    const { body } = req
    console.log({ body })
    try {
      const market = await models.market.create(body)
      res.json(market)
    } catch (error) {
      console.error(error)
      res.sendStatus(503)
    }
  })
  app.put('/api/markets', async (req, res) => {
    const { id, name, year, symbol, purchasePrice, change, soldPrice } = req.body
    try {
      await models.market.update({ name, year, symbol, purchasePrice, change, soldPrice }, { where: { id } })
    } catch (error) {
      console.error(error)
    }
    res.sendStatus(200)
  })
  app.delete('/api/market/:id', async (req, res) => {
    const { id } = req.params
    await models.market.destroy({ where: { id } })
    res.send(201)
  })
}
