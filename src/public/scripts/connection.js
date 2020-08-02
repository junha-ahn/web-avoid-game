const socket = io()

const mouse = {
	x: 0,
	y: 0,
}
let ServerData

function startGame() {
	socket.emit('start-game')
}
startGame()

socket.on('on-game', (data) => {
	if (ServerData == null || data.sequence >= ServerData.sequence) {
		ServerData = data
		// PlayerList(data.players)
		socket.emit('on-game', {
			sequence: Date.now(),
			...mouse,
		})
	} else {
		console.log('ignore on-game')
	}
})
socket.on('ended-game', (data) => {
	ServerData = data

	setTimeout(startGame, 5000)
})
