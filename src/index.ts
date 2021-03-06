import * as http from 'http'
import * as express from 'express'
import logger from './modules/logger'
import loaders from './loaders'

const app = express()
const PORT = process.env.PORT || 3000

const server = http.createServer(app)

loaders(app, server)

server.listen(PORT, () => {
	logger.info(`Server listening on port: ${PORT} (http://127.0.0.1:${PORT})`)
})
