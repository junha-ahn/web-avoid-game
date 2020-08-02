import * as socket from 'socket.io'
import { Server } from 'http'

import logger from '../../modules/logger'
import GameController from '../../modules/game-controller'
import { sleep } from '../../modules/helpers'

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

		socket.on('start-game', async () => {
			if (gameController.isEnd()) {
				gameController.init()
			}

			while (1) {
				if (gameController.isEnd()) {
					socket.emit('ended-game', gameController.parse(socket.id))
					break
				} else if (gameController.isPlaying()) {
					socket.emit('on-game', gameController.parse(socket.id))
				}
				await sleep(10)
			}
		})
		socket.on('on-game', async (data) => {
			gameController.updatePlayer(socket.id, data.x, data.y, data.sequence)
		})

		socket.on('disconnect', () => {
			logger.info(`disconnect`)
			gameController.delPlayer(socket.id)
		})
	})
}
