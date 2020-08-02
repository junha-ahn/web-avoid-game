class Mover {
	constructor(isPlayer, x, y, size, color) {
		this.isPlayer = isPlayer
		this.x = x
		this.y = y
		this.size = size
		this.color = color
	}
}

Mover.prototype.draw = function () {
	fill(this.color)

	if (this.isPlayer) {
		ellipse(this.x, this.y, this.size / 2, this.size / 2)
	} else {
		stroke(255)
		strokeWeight(3)
		rect(this.x, this.y, this.size, this.size)
	}
}
