const socket = io()

const mouse = {
	x: 0,
	y: 0,
}
let ServerData

function startGame() {
	console.log('click startGame')
	socket.emit('start-game')
}

socket.on('on-game', (data) => {
	ServerData = data
	socket.emit('on-game', mouse)
})
socket.on('ended-game', (data) => {
	ServerData = data
})
