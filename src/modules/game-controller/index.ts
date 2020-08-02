import { Player, Projectile } from './objects'
import { sleep } from '../helpers'

const config = {
	WIDTH: 1000,
	HEIGHT: 800,
	PLAYER_SIZE: 30,
	PROJECTILE_RESPONSE_TIME: 3000,
}

const random = (max, min = 0): number => Math.random() * (max - min) + min
const randomColor = (): [number, number, number] => [
	random(255),
	random(255),
	random(255),
]

export default class GameController {
	private difficulty = 2

	private startedAt
	private endedAt

	private players: Player[] = []
	private projectiles: Projectile[] = []

	constructor() {}

	get movers() {
		return this.players.filter((e) => e.startedAt)
	}

	async init() {
		this.startedAt = Date.now()
		this.endedAt = null
		this.difficulty = 2

		this.players.forEach((p) => {
			p.init(
				config.WIDTH / 2,
				config.HEIGHT / 2,
				config.PLAYER_SIZE,
				randomColor(),
				this.difficulty * 2,
			)
		})
		this.projectiles = []

		while (!this.isEnd()) {
			this.update()
			await sleep(10)
		}
	}

	private update() {
		for (let i = this.movers.length - 1; i >= 0; i--) {
			const p = this.movers[i]
			if (this.isDisConnect(p.sequence)) {
				this.delPlayer(p.id)
				continue
			}
			p.update()
			if (p.isOffscreen(config.WIDTH, config.HEIGHT)) p.end()
		}
		this.handleProjectiles()
		this.addProjectile()
	}
	private getRandomEdge() {
		const plane = random(1) > 0.5
		const x = plane ? random(config.WIDTH) : random(1) > 0.5 ? 0 : config.WIDTH
		const y = plane
			? random(1) > 0.5
				? 0
				: config.HEIGHT
			: random(config.HEIGHT)

		return [x, y]
	}
	private createProjectile() {
		const [x, y] = this.getRandomEdge()

		return new Projectile(
			false,
			x,
			y,
			random(35),
			randomColor(),
			this.movers[parseInt(`${random(this.movers.length - 1)}`)],
			this.difficulty,
		)
	}

	private createItem() {
		const [x, y] = this.getRandomEdge()

		return new Projectile(
			true,
			x,
			y,
			20,
			randomColor(),
			this.movers[parseInt(`${random(this.movers.length - 1)}`)],
			this.difficulty,
		)
	}

	private addProjectile() {
		const time = Date.now() - this.startedAt
		if (this.projectiles.length <= time / config.PROJECTILE_RESPONSE_TIME) {
			if (random(this.difficulty) > 1.25)
				this.projectiles.push(this.createProjectile())
			else if (random(this.difficulty) < 0.25)
				this.projectiles.push(this.createItem())
			this.difficulty += 0.025
		}
	}
	private handleProjectiles() {
		const projectiles = this.projectiles
		for (let i = projectiles.length - 1; i >= 0; i--) {
			const projectile = projectiles[i]
			projectile.update()

			// 투사체가 스크린 밖으로 나가면
			if (projectile.isOffscreen(config.WIDTH, config.HEIGHT))
				return projectiles.splice(i, 1)

			for (const p of this.movers) {
				if (projectile.collidesWith(p)) {
					if (projectile.isItem) p.life++
					else p.crashed()
					projectiles.splice(i, 1)
				}
			}
		}
	}

	addPlayer(id: string) {
		this.players.push(new Player(id))
	}
	updatePlayer(id: string, x: number, y: number, sequence?: number) {
		const player = this.movers.find((p) => p.id === id)
		if (!player) return
		if (player.sequence > sequence) return console.log('ignore updatePlayer')
		player.sequence = sequence
		player.updateMouse(x, y)
	}
	delPlayer(id: string) {
		const index = this.players.findIndex((p) => p.id === id)
		this.players.splice(index, 1)
	}

	// 브라우저 강제 종료시 동작
	private isDisConnect(time) {
		const ONE_SEC = 3000
		return time === 0 ? false : Date.now() - ONE_SEC > time
	}
	isPlaying() {
		return this.startedAt != null && this.endedAt == null
	}
	isEnd() {
		const result = this.movers.every((p) => p.endedAt)
		if (result) this.endedAt = Date.now()
		return result
	}
	/**
	 * @param  {string} id player socket id
	 */
	parse(id: string) {
		const parse = (p) => ({
			isMine: p.id === id,
			score: (p.endedAt ? p.endedAt : Date.now()) - this.startedAt,
			...p,
		})
		return {
			sequence: Date.now(),
			startedAt: this.startedAt,
			endedAt: this.endedAt,
			movers: this.movers.map(parse),
			players: this.players.map(parse),
			projectiles: this.projectiles,
		}
	}
}
