class Mover {
	constructor(maker, x, y, size, color) {
		this.maker = maker
		this.x = x
		this.y = y
		this.size = size
		this.color = color
	}
}

Mover.prototype.draw = function () {
	fill(this.color)
	stroke(255)
	strokeWeight(3)

	this.maker(this.x, this.y, this.size, this.size)
}
