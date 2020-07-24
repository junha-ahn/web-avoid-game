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
	end() {
		this.isActive = false
	}
	isOffscreen() {
		return (
			this.x < 0 ||
			this.x + this.size > config.WIDTH ||
			this.y < 0 ||
			this.y + this.size > config.HEIGHT
		)
	}
	collidesWith(square: Square) {
		// 투사체(this) 위치 계산

		const center = {
			x: this.position.x + this.size / 2,
			y: this.position.y + this.size / 2,
		}

		// player 위치 계산
		const rightBound = {
			x: square.position.x + square.size,
			y: square.position.y + square.size,
		}

		return !(
			center.x < square.position.x ||
			center.x > rightBound.x ||
			center.y < square.position.y ||
			center.y > rightBound.y
		)
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
	constructor(players: string[]) {
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

	handlePlayer(player: Square, x: number, y: number) {
		player.x = x
		player.y = y
		if (player.isOffscreen()) player.end()
	}
	handleProjectiles() {
		for (const projectile of this.projectiles) {
			const players = this.players.values()
			if (projectile.isOffscreen()) projectile.end()

			for (const player of players) {
				if (projectile.collidesWith(player)) player.end()
			}
		}
	}

	/**
	 * @param  {string} id
	 * @param  {{x:number;y:number}} data x/y is player's mouse X/Y point
	 */
	update(id: string, data: { x: number; y: number }) {
		this.handlePlayer(this.players.get(id), data.x, data.y)
		this.handleProjectiles()
		this.addProjectile()
	}

	isEnd() {
		return Array.from(this.players.entries()).every(
			([id, player]) => !player.isActive,
		)
	}
	/**
	 * @param  {string} id player socket id
	 */
	parse(id: string) {
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
