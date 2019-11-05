const stock = require('../controllers/stock')
const duda = require('../controllers/duda')
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
      const created = await stock.create(stocks[i])
      stocksCreate.push(created.dataValues)
    }
    res.json(stocksCreate)
  })
  app.put('/api/stocks', async (req, res) => {
    await stock.update(req.body)
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
    const data = await duda.updateCurrentPrices()
    res.json(data)
  })
  app.get('/api/alpha/stocks/update', (req, res) => {
    duda.updateCurrentStocks()
    res.sendStatus(200)
  })
}
