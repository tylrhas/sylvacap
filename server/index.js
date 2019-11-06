require('dotenv').config()
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const expressSession = require('express-session')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
require('./controllers/schedule')
const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
}

if (app.get('env') === 'production') {
  // Serve secure cookies, requires HTTPS
  app.set('trust proxy', 1) // trust first proxy
  session.cookie.secure = true
}

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    
    return done(null, profile)
  }
)
app.use(expressSession(session))

passport.use(strategy)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
}
)

// Creating custom middleware with Express
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

const secured = (req, res, next) => {
  if (req.user) {
    return next()
  }
  req.session.returnTo = req.originalUrl
  res.redirect('/login')
}
require('./routes/auth')(app)

app.use(secured)
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
const models = require('./models')
config.dev = process.env.NODE_ENV !== 'production'
async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  app.use(bodyParser.json({ limit: '1000kb' }))

  // Give nuxt middleware to express
  require('./routes/api')(app)
  app.use(nuxt.render)
  models.sequelize
    .sync()
  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
