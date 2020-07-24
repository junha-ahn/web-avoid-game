import * as socket from 'socket.io'
import { Server } from 'http'

import logger from '../../modules/logger'
import GameController from '../../modules/gameController'

const CustomLog = (socket: socket.Socket) => ({
	info: (msg = '') => logger.info(`[${socket.id.substring(0, 6)}] ${msg}`),
})

export default (server: Server) => {
	const io = socket(server)

	let gameController: GameController
	io.on('connection', (socket) => {
		const logger = CustomLog(socket)
		logger.info(`connected`)

		socket.on('start-game', () => {
			gameController = new GameController(Object.keys(io.sockets.sockets))
			socket.broadcast.emit('started-game', gameController.parse(socket.id))
		})

		socket.on('on-game', (data) => {
			gameController.update(socket.id, data)
			if (gameController.isEnd()) {
				socket.broadcast.emit('ended-game', gameController.parse(socket.id))
			} else {
				socket.broadcast.emit('on-game', gameController.parse(socket.id))
			}
		})
	})
}
