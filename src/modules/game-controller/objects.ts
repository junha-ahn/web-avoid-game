import * as Vector from './p5/vector'

type colorType = [number, number, number]

export class Player {
	public endedAt
	public position
	public velocity
	public acceleration
	public mouse = { x: 0, y: 0 }

	constructor(x, y, public size, public color: colorType, public speed) {
		this.position = new Vector(x, y)
		this.velocity = new Vector()
		this.acceleration = new Vector()
	}
	end() {
		this.endedAt = Date.now()
	}
	updateMouse(x: number, y: number) {
		this.mouse.x = x
		this.mouse.y = y
	}
	update() {
		const mouse = new Vector(this.mouse.x, this.mouse.y)
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
		player: Player,
		public speed,
	) {
		this.position = new Vector(x, y)

		this.velocity = this.setVelocity(this.position, player)
	}
	collidesWith(player: Player) {
		// 투사체(this) 위치 계산
		const cX = this.position.x + this.size / 2
		const cY = this.position.y + this.size / 2
		const center = new Vector(cX, cY)

		// player 위치 계산
		const rX = player.position.x + player.size
		const rY = player.position.y + player.size
		const rightBound = new Vector(rX, rY)

		return !(
			center.x < player.position.x ||
			center.x > rightBound.x ||
			center.y < player.position.y ||
			center.y > rightBound.y
		)
	}
	setVelocity(vel1, vel2?: Player) {
		if (vel1 != null && vel2 != null) {
			const velocity = new Vector(
				vel2.position.x - vel1.x,
				vel2.position.y - vel1.y,
			)
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
