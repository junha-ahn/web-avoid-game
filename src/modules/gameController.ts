const config = {
	WIDTH: 1000,
	HEIGHT: 800,
	PLAYER_SIZE: 30,
	PROJECTILE_RESPONSE_TIME: 30,
}

type colorType = [number, number, number]

const random = (max, min = 0): number => Math.random() * (max - min) + min
const randomColor = (): colorType => [random(255), random(255), random(255)]

class Square {
	public isActive = true
	public target // only for Projectile
	constructor(
		public x: number,
		public y: number,
		public size: number,
		public color: colorType,
		public speed: number,
		target?,
	) {
		this.target = target
	}

	get position() {
		return {
			x: this.x,
			y: this.y,
		}
	}
}

export default class GameController {
	public difficulty = 2
	public startedAt = Date.now()

	public players: Map<string, Square>
	public projectiles: Square[] = []
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
	}

	createProjectile() {
		const plane = random(1) > 0.5

		/* 모서리에 사각형만 생성하도록 함 */
		const x = plane ? random(config.WIDTH) : random(1) > 0.5 ? 0 : config.WIDTH
		const y = plane
			? random(1) > 0.5
				? 0
				: config.HEIGHT
			: random(config.HEIGHT)

		return new Square(
			x,
			y,
			random(35),
			randomColor(),
			this.difficulty,
			// player.position,
		)
	}

	addProjectile() {
		const time = this.startedAt - Date.now()
		if (this.projectiles.length <= time / config.PROJECTILE_RESPONSE_TIME) {
			if (random(this.difficulty) > 1.25)
				this.projectiles.push(this.createProjectile())
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
