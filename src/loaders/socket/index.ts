import * as socket from 'socket.io'
import { Server } from 'http'

import logger from '../../modules/logger'

const CustomLog = (socket: socket.Socket) => ({
	info: (msg = '') => logger.info(`[${socket.id.substring(0, 6)}] ${msg}`),
})

class DodgeGame {
	players: Map<string, {}>
	projectiles: any[]
	constructor(players: string[]) {
		this.players = new Map(players.map((e) => [e, {}]))
		this.projectiles = []
	}

	isEnd() {
		return false
	}

	parse(id: string) {
		const entries = Array.from(this.players.entries())
		return {
			players: entries.map(([pid, pValue]) => ({
				// isEnd: false,
				isMine: pid === id,
				...pValue,
			})),
			projectiles: this.projectiles,
		}
	}
}

export default (server: Server) => {
	const io = socket(server)

	let dodgeGame: DodgeGame
	io.on('connection', (socket) => {
		const logger = CustomLog(socket)
		logger.info(`connected`)

		socket.on('start-game', (data) => {
			dodgeGame = new DodgeGame(Object.keys(io.sockets.sockets))
			socket.broadcast.emit('started-game', dodgeGame.parse(socket.id))
		})

		socket.on('on-game', (data) => {
			// dodgeGame.update(data)

			if (dodgeGame.isEnd()) {
				socket.broadcast.emit('ended-game', dodgeGame.parse(socket.id))
			} else {
				socket.broadcast.emit('on-game', dodgeGame.parse(socket.id))
			}
		})
	})
}
