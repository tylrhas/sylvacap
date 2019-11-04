const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')

const {
  DATABASE_URL: dbUrl,
  DATABASE_MAX_CONNECTIONS: max,
  DATABASE_MIN_CONNECTIONS: min,
  DATABASE_IDLE: idle,
  DATABASE_AQUIRE: acquire,
  DATABASE_EVICT: evict,
  DATABASE_SSL: ssl
} = process.env

const minTest = parseInt(min)
const maxTest = parseInt(max)
const idleTest = parseInt(idle)
const acquireTest = parseInt(acquire)
const evictTest = parseInt(evict)

const sequelize = new Sequelize(dbUrl, {
  pool: { max: maxTest, min: minTest, idle: idleTest, acquire: acquireTest, evict: evictTest },
  dialectOptions: {
    ssl: (ssl === 'true')
  }
})

const db = {}

fs.readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js') // get all the model files
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file))
    const { name } = model
    db[name] = model
  })

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

module.exports = { ...db, sequelize, Sequelize }
