const socket = io()

const mouse = {
	x: 0,
	y: 0,
}
let ServerData

function startGame() {
	console.log('start Game!!')
	socket.emit('start-game')
}
startGame()

socket.on('on-game', (data) => {
	ServerData = data
	socket.emit('on-game', mouse)
})
socket.on('ended-game', (data) => {
	ServerData = data

	setTimeout(startGame, 5000)
})
