const socket = io()

let players, projectiles

function setup() {
	createCanvas(1000, 800)

	textAlign(CENTER)
	textSize(40)
}

function draw() {
	background(53) // 캔버스 바탕 화면 색상

	drawScore() //버틴시간 화면에 표시
}

// 스코어 (버틴시간)
function drawScore() {
	noStroke()
	text(frameCount, width / 2, 50)
	// 스코어(버틴시간), 가로, 세로
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
