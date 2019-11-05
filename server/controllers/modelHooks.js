const axios = require('axios')
const rateLimit = require('axios-rate-limit')
const http = rateLimit(axios.create(), { maxRequests: 5, perMilliseconds: 1000 })

const {
  DUDA_BASE_URL,
  DUDA_SITE_ID,
  DUDA_STOCK_COLLECTION_NAME,
  DUDA_AUTH_HEADER
} = process.env

module.exports = {
  removeStock
}
function removeStock (body) {
  return http.delete(`${DUDA_BASE_URL}/${DUDA_SITE_ID}/collection/${DUDA_STOCK_COLLECTION_NAME}/row`, body, { headers: { authorization: DUDA_AUTH_HEADER } })
}
