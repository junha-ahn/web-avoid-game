import * as socket from 'socket.io'
import { Server } from 'http'

import logger from '../../modules/logger'
import GameController from '../../modules/game-controller'

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
			logger.info('on: started-game')
			if (!gameController || gameController.isEnd()) {
				gameController = new GameController(Object.keys(io.sockets.sockets))
				io.emit('started-game', gameController.parse(socket.id))
			}
		})

		socket.on('on-game', (data) => {
			// logger.info('on: on-game')
			gameController.update(socket.id, data)
			if (gameController.isEnd()) {
				io.emit('ended-game', gameController.parse(socket.id))
			} else {
				io.emit('on-game', gameController.parse(socket.id))
			}
		})
	})
}
