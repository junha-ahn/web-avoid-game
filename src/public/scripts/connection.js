const socket = io()

const mouse = {
	x: 0,
	y: 0,
}
let players, projectiles

function setup() {
	createCanvas(1000, 800)

	mouse.x = mouseX
	mouse.y = mouseY
}

function draw() {
	background(53) // 캔버스 바탕 화면 색상
	// drawScore()
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
	new p5((p) => {
		p.draw = () => {
			noLoop()
			drawScore(data.score)
		}
	})
	socket.emit('on-game', mouse)
})
