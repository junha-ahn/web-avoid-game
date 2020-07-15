const expressLoader = require('./express')
const socketLoader = require('./socket')
const logger = require('../modules/logger')

module.exports = async (app, server) => {
	expressLoader(app)
	logger.info('Express loaded')

	socketLoader(server)
	logger.info('Socket loaded')
}
