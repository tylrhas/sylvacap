const stock = require('../controllers/stock')
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
}
