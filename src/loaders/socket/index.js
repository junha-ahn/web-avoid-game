const logger = (socket) => (...args) =>
	console.log(`[${socket.id.substring(0, 6)}]`, ...args)

module.exports = (server) => {
	const io = require('socket.io')(server)
	console.log('socket loaded!')
	io.on('connection', (socket) => {
		const log = logger(socket)
		log(`접속`)
	})
}
