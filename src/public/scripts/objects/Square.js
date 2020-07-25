class Square {
	constructor(x, y, size, color) {
		this.x = x
		this.y = y
		this.size = size
		this.color = color
	}
}

Square.prototype.draw = function () {
	fill(this.color)
	stroke(255)
	strokeWeight(3)

	rect(this.position.x, this.position.y, this.size, this.size)
}
