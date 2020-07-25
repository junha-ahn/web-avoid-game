import Vector from './p5/Vector'

type colorType = [number, number, number]

export class Player {
	public isActive = true
	public position
	public velocity
	public acceleration

	constructor(x, y, public size, public color: colorType, public speed) {
		this.position = new Vector(x, y)
		this.velocity = new Vector()
		this.acceleration = new Vector()
	}
	end() {
		this.isActive = false
	}
	update(x: number, y: number) {
		const mouse = new Vector(x, y)
		this.acceleration = Vector.sub(mouse, this.position)
		this.acceleration.setMag(0.2)
		this.velocity.add(this.acceleration)
		this.velocity.limit(this.speed)
		this.position.add(this.velocity)
	}
	isOffscreen(width: number, height: number) {
		return (
			this.position.x < 0 ||
			this.position.x + this.size > width ||
			this.position.y < 0 ||
			this.position.y + this.size > height
		)
	}
}

export class Projectile {
	public position
	public velocity
	constructor(
		x,
		y,
		public size,
		public color: colorType,
		player,
		public speed,
	) {
		this.position = new Vector(x, y)

		this.velocity = this.setVelocity(this.position, player)
	}
	collidesWith(square) {
		// 투사체(this) 위치 계산
		const cX = this.position.x + this.size / 2
		const cY = this.position.y + this.size / 2
		const center = new Vector(cX, cY)

		// player 위치 계산
		const rX = square.position.x + square.size
		const rY = square.position.y + square.size
		const rightBound = new Vector(rX, rY)

		return !(
			center.x < square.position.x ||
			center.x > rightBound.x ||
			center.y < square.position.y ||
			center.y > rightBound.y
		)
	}
	setVelocity(vel1, vel2) {
		if (vel1 != null && vel2 != null) {
			const velocity = new Vector(vel2.x - vel1.x, vel2.y - vel1.y)
			velocity.setMag(this.speed)
			return velocity
		}
		return new Vector(1, 0)
	}
	isOffscreen(width: number, height: number) {
		return (
			this.position.x < 0 ||
			this.position.x + this.size > width ||
			this.position.y < 0 ||
			this.position.y + this.size > height
		)
	}
	update() {
		this.position.add(this.velocity)
	}
}
