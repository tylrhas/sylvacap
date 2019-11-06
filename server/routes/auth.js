const util = require('util')
const url = require('url')
const querystring = require('querystring')
const passport = require('passport')
module.exports = (app) => {
  app.get(
    '/login',
    passport.authenticate('auth0', {}),
    (req, res) => {
      res.redirect('/')
    }
  )

  app.get('/callback', (req, res, next) => {
    passport.authenticate('auth0', (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err)
        }
        const returnTo = req.session.returnTo
        delete req.session.returnTo
        res.redirect(returnTo || '/')
      })
    })(req, res, next)
  })

  app.get('/logout', (req, res) => {
    req.logOut()

    let returnTo = req.protocol + '://' + req.hostname
    const port = req.connection.localPort

    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo =
      process.env.NODE_ENV === 'production'
        ? `${returnTo}/`
        : `${returnTo}:${port}/`
    }

    const logoutURL = new URL(
      util.format('https://%s/logout', process.env.AUTH0_DOMAIN)
    )
    const searchString = querystring.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo
    })
    logoutURL.search = searchString

    res.redirect(logoutURL)
  })
}
