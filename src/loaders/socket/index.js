const logger = require('../../modules/logger')

const CustomLog = (socket) => ({
	info: (msg = '') => logger.info(`[${socket.id.substring(0, 6)}] ${msg}`),
})

class DodgeGame {
	constructor(players) {
		this.players = new Map(players.map((e) => [e, {}]))
		this.projectiles = []
	}

	isEnd() {
		return false
	}

	parse(id) {
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

module.exports = (server) => {
	const io = require('socket.io')(server)

	let dodgeGame
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
