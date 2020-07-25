import { Player, Projectile } from './objects'

const config = {
	WIDTH: 1000,
	HEIGHT: 800,
	PLAYER_SIZE: 30,
	PROJECTILE_RESPONSE_TIME: 30,
}

const random = (max, min = 0): number => Math.random() * (max - min) + min
const randomColor = (): [number, number, number] => [
	random(255),
	random(255),
	random(255),
]

export default class GameController {
	public difficulty = 2
	public startedAt = Date.now()

	public players: Map<string, Player>
	public projectiles: Projectile[] = []
	/**
	 * @param  {string[]} players players's socket id
	 */
	constructor(players: string[]) {
		this.players = new Map(
			players.map((id) => [
				id,
				new Player(
					config.WIDTH / 2,
					config.HEIGHT / 2,
					config.PLAYER_SIZE,
					randomColor(),
					this.difficulty * 2,
				),
			]),
		)
	}
	get score() {
		return Date.now() - this.startedAt
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
		const players = Array.from(this.players.values())
		return new Projectile(
			x,
			y,
			random(35),
			randomColor(),
			this.difficulty,
			players[random(players.length - 1)],
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

	handlePlayer(player: Player, x: number, y: number) {
		if (!player) return
		player.update(x, y)
		if (player.isOffscreen(config.WIDTH, config.HEIGHT)) player.end()
	}
	handleProjectiles() {
		const projectiles = this.projectiles
		for (let i = projectiles.length - 1; i >= 0; i--) {
			this.projectiles[i].update()

			// 투사체가 스크린 밖으로 나가면
			if (projectiles[i].isOffscreen(config.WIDTH, config.HEIGHT))
				projectiles.splice(i, 1)

			const players = this.players.values()
			for (const player of players) {
				if (projectiles[i].collidesWith(player)) player.end()
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
			([id, player]) => player.endedAt,
		)
	}
	/**
	 * @param  {string} id player socket id
	 */
	parse(id: string) {
		const entries = Array.from(this.players.entries())
		return {
			score: this.score,
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
