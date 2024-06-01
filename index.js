const http = require('http')
const app = require('./app')

const { log } = require('console')

const server = http.createServer(app)

const port = process.env.PORT || 3000;
server.listen(port)

log("Connected")
