function setup() {
	createCanvas(1000, 800)

	textAlign(CENTER)
	textSize(40)
}

function draw() {
	// 10 ~ 20 ms 단위 실행

	mouse.x = mouseX
	mouse.y = mouseY

	background(53)

	if (!ServerData) return
	if (ServerData.endedAt && Date.now() > ServerData.endedAt + 2000)
		return endGame()

	drawScore(ServerData.score)

	handlePlayer(ServerData.players)
	handleProjectiles(ServerData.projectiles)
}

function handlePlayer(players) {
	for (p of players) {
		if (p.isMine) drawScore(p.score)
		const player = new Square(
			p.position.x,
			p.position.y,
			p.size,
			p.isMine ? color('#FFFFFF') : color(p.color),
		)
		// 사망 후, 1초 유지
		if (!p.endedAt || Date.now() < p.endedAt + 1000) player.draw()
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
function endGame() {
	// noLoop()
	// textSize(70)
	// fill(255)
	// noStroke()
	text('Game Over!', width / 2, height / 2)
	// textSize(40)
}
