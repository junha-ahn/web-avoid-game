let player, difficulty
const projectiles = [] // 투사체

function setup() {
	createCanvas(1000, 800)

	difficulty = 2
	// 사용자가 조종할 네모
	player = new Mover(
		width / 2,
		height / 2,
		30,
		color('#FFFFFF'),
		difficulty * 2,
	)

	textAlign(CENTER)
	textSize(40)
}

function draw() {
	background(53) // 캔버스 바탕 화면 색상

	handleProjectiles() //네모 생성, 충돌감지
	handlePlayer()

	addProjectile(frameCount) //버틴시간마다 힘들게해주는고

	drawScore() //버틴시간 화면에 표시
}

// 새 투사체 추가
function addProjectile(time) {
	if (time % 30 === 0) {
		if (random(difficulty) > 1.25) projectiles.push(createProjectile())
		difficulty += 0.05 // 난이도 조정
	}
}

// 스코어 (버틴시간)
function drawScore() {
	noStroke()
	text(frameCount, width / 2, 50)
	// 스코어(버틴시간), 가로, 세로
}

// 투사체 관리
function handleProjectiles() {
	for (let i = projectiles.length - 1; i >= 0; i--) {
		projectiles[i].update()
		projectiles[i].draw()

		// 네모가 사용자네모랑 부딛히면
		if (projectiles[i].collidesWith(player)) endGame()

		// 투사체가 스크린 밖으로 나가면
		if (projectiles[i].isOffscreen()) projectiles.splice(i, 1)
	}
}

function handlePlayer() {
	player.update(true)
	player.draw()

	// 플레이어가 스크린 밖으로 나가면
	if (player.isOffscreen()) endGame()
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

// 투사체 생성
function createProjectile() {
	const plane = random() > 0.5

	/* 모서리에 사각형만 생성하도록 함 */
	const x = plane ? random(width) : random() > 0.5 ? 0 : width
	const y = plane ? (random() > 0.5 ? 0 : height) : random(height)

	return new Projectile(
		x,
		y,
		random(35),
		randomColor(),
		player.position,
		difficulty,
	) // 투사체 너비, 높이, 크기(최대35), 색상... 랜덤
	// (플레이어의 포지션을 향해 돌진)
}

// 랜덤색상
function randomColor() {
	return color(random(255), random(255), random(255))
}
