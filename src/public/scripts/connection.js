const socket = io()

let players, projectiles

const mouse = {
	x: 0,
	y: 0,
}
let ServerData = {}

function setup() {
	createCanvas(1000, 800)

	textAlign(CENTER)
	textSize(40)
}

function draw() {
	// 10 ~ 20 ms 단위 실행

	mouse.x = mouseX
	mouse.y = mouseY

	background(53) // 캔버스 바탕 화면 색상

	if (ServerData.endedAt) return endGame()

	drawScore(ServerData.score)

	handleProjectiles(ServerData.projectiles)
	handlePlayer(ServerData.players)
}

function handlePlayer(players) {
	for (p of players) {
		const player = new Square(
			p.position.x,
			p.position.y,
			p.size,
			p.isMine ? color('#FFFFFF') : color(p.color),
		)
		player.draw()
	}
}
function handleProjectiles(projectiles) {
	for (p of projectiles) {
		const projectiles = new Square(p.position.x, p.position.y, p.size, p.color)
		projectiles.draw()
	}
}
function drawScore(score) {
	noStroke()
	text(score, width / 2, 50)
}

// 게임 종료!
function endGame() {
	noLoop()
	textSize(70)
	fill(255)
	noStroke()
	text('Game Over!', width / 2, height / 2)
	textSize(40)
}

socket.emit('start-game')

socket.on('on-game', (data) => {
	ServerData = data
	socket.emit('on-game', mouse)
})

socket.on('ended-game', (data) => {
	endGame()
})
