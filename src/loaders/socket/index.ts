import * as socket from 'socket.io'
import { Server } from 'http'

import logger from '../../modules/logger'
import GameController from '../../modules/game-controller'

const CustomLog = (socket: socket.Socket) => ({
	info: (msg = '') => logger.info(`[${socket.id.substring(0, 6)}] ${msg}`),
})
export default (server: Server) => {
	const io = socket(server)

	const gameController = new GameController()
	io.on('connection', (socket) => {
		const logger = CustomLog(socket)
		logger.info(`connected`)

		gameController.addPlayer(socket.id)
		socket.emit('connected-player', Object.keys(io.sockets.sockets))

		socket.on('start-game', () => {
			if (!gameController.isPlaying() || gameController.isEnd()) {
				gameController.init()
				io.emit('on-game', gameController.parse(socket.id))
			}
		})

		socket.on('on-game', async (data) => {
			gameController.updatePlayer(socket.id, data.x, data.y)
			if (gameController.isEnd()) {
				io.emit('ended-game', gameController.parse(socket.id))
			} else {
				io.emit('on-game', gameController.parse(socket.id))
			}
		})

		socket.on('disconnect', () => {
			logger.info(`disconnect`)
			gameController.delPlayer(socket.id)
		})
	})
}
