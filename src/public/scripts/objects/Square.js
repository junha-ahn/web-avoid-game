class Mover {
	constructor(type, x, y, size, color) {
		this.type = type
		this.x = x
		this.y = y
		this.size = size
		this.color = color
	}
}

Mover.prototype.draw = function () {
	fill(this.color)

	if (this.type === 'player') {
		circle(this.x, this.y, this.size / 2)
	} else if (this.type === 'item') {
	} else {
		stroke(255)
		strokeWeight(3)
		rect(this.x, this.y, this.size, this.size)
	}
}
