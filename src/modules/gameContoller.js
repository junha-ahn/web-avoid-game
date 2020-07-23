const config = {
	WIDTH: 1000,
	HEIGHT: 800,
	PLAYER_SIZE: 30,
	PROJECTILE_RESPONSE_TIME: 30,
}

const random = (max, min = 0) => Math.random() * (max - min) + min
const randomColor = [random(255), random(255), random(255)]

class Square {
	target = undefined // only for Projectile
	constructor(x, y, size, color, speed, target) {
		this.isActive = true
		this.x = x
		this.y = y
		this.size = size
		this.color = color
		this.speed = speed
		this.target = target
	}
}

module.exports = class GameContoller {
	difficulty = 2
	startedAt = Date.now()
	/**
	 * @param  {string[]} players players's socket id
	 */
	constructor(players) {
		this.players = new Map(
			players.map((id) => [
				id,
				new Square(
					config.WIDTH / 2,
					config.HEIGHT / 2,
					config.PLAYER_SIZE,
					randomColor(),
					this.difficulty * 2,
				),
			]),
		)
		this.projectiles = []
	}

	createProjectile() {
		const plane = random(1) > 0.5

		/* 모서리에 사각형만 생성하도록 함 */
		const x = plane ? random(config.WIDTH) : random() > 0.5 ? 0 : config.WIDTH
		const y = plane
			? random() > 0.5
				? 0
				: config.HEIGHT
			: random(config.HEIGHT)

		return new Square(
			x,
			y,
			random(35),
			randomColor(),
			difficulty,
			// player.position,
		)
	}

	addProjectile() {
		const time = this.startedAt - Date.now()
		if (this.projectiles.length <= time / PROJECTILE_RESPONSE_TIME) {
			if (random(this.difficulty) > 1.25) projectiles.push(createProjectile())
			this.difficulty += 0.1
		}
	}

	update(data) {
		this.addProjectile()
	}

	isEnd() {
		return false
	}

	parse(id) {
		const entries = Array.from(this.players.entries())
		return {
			startedAt: this.startedAt,
			players: entries.map(([pid, pValue]) => ({
				// isEnd: false,
				isMine: pid === id,
				...pValue,
			})),
			projectiles: this.projectiles,
		}
	}
}
