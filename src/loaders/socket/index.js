const logger = require('../../modules/logger')

const CustomLog = (socket) => ({
	info: (msg = '') => logger.info(`[${socket.id.substring(0, 6)}] ${msg}`),
})

module.exports = (server) => {
	const io = require('socket.io')(server)
	logger.info('socket loaded!')

	io.on('connection', (socket) => {
		const logger = CustomLog(socket)
		logger.info(`connected`)
	})
}
