const http = require('http')
const express = require('express')
const path = require('path')

const socketLoader = require('./loaders/socket')
const logger = require('./modules/logger')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')))

const server = http.createServer(app)

socketLoader(server)

server.listen(PORT, () => {
	logger.info(`Server listening on port: ${PORT} (http://127.0.0.1:${PORT})`)
})
