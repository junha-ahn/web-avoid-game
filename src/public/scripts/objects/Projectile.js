class Projectile {
	constructor(x, y, size, color, player, speed) {
		this.position = createVector(x, y)

		this.speed = speed

		this.velocity = this.setVelocity(this.position, player)

		this.size = size
		this.color = color
	}
}

Projectile.prototype.isOffscreen = function () {
	return (
		this.position.x < 0 ||
		this.position.x + this.size > width ||
		this.position.y < 0 ||
		this.position.y + this.size > height
	)
}

// 속도에 따른 위치 변경
Projectile.prototype.update = function () {
	this.position.add(this.velocity)
}

// 투사체를 화면에 그린다
Projectile.prototype.draw = function () {
	fill(this.color)
	stroke(255)
	strokeWeight(3)

	rect(this.position.x, this.position.y, this.size, this.size)
}

// 충돌여부 검사
Projectile.prototype.collidesWith = function (square) {
	// 투사체(this) 위치 계산
	const cX = this.position.x + this.size / 2
	const cY = this.position.y + this.size / 2
	const center = createVector(cX, cY)

	// player 위치 계산
	const rX = square.position.x + square.size
	const rY = square.position.y + square.size
	const rightBound = createVector(rX, rY)

	return !(
		center.x < square.position.x ||
		center.x > rightBound.x ||
		center.y < square.position.y ||
		center.y > rightBound.y
	)
}

Projectile.prototype.setVelocity = function (vel1, vel2) {
	if (vel1 != null && vel2 != null) {
		const velocity = createVector(vel2.x - vel1.x, vel2.y - vel1.y)
		velocity.setMag(this.speed)
		return velocity
	}
	return createVector(1, 0)
}
