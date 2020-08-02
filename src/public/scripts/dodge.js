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

	// const x = 60
	// const y = 40
	// const size = 30
	// triangle(a, b, 위 꼭지점 x, 맨 꼭지점 y, e,f,g)
	// triangle(30, 75 - 10, 58, 20 - 10, 86, 75 - 10)
	// triangle(x, y, x + size / 2, y - size / 2, x + size, y)

	if (!ServerData) return
	if (ServerData.endedAt && Date.now() > ServerData.endedAt + 2000)
		return endGame()

	handleMovers(ServerData.movers)
	handleProjectiles(ServerData.projectiles)
}

function handleMovers(movers) {
	for (p of movers) {
		if (p.isMine) drawScore(p.score)

		const mover = new Mover(
			'player',
			p.position.x,
			p.position.y,
			p.size,
			p.isMine ? color('#FFFFFF') : color(p.color),
		)
		// 사망 후, 1초 유지
		if (!p.endedAt || Date.now() < p.endedAt + 1000) mover.draw()
	}
}
function handleProjectiles(projectiles) {
	for (p of projectiles) {
		const projectiles = new Mover(
			p.isItem ? 'item' : 'projectile',
			p.position.x,
			p.position.y,
			p.size,
			p.color,
		)
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
