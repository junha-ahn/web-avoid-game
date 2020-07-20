class Mover {
	constructor(x, y, size, color, speed) {
		this.position = createVector(x, y)
		this.topspeed = speed
		this.velocity = createVector()
		this.acceleration = createVector()
		this.size = size
		this.color = color
	}
}

Mover.prototype.update = function () {
	const mouse = createVector(mouseX, mouseY)
	this.acceleration = p5.Vector.sub(mouse, this.position)
	this.acceleration.setMag(0.2)
	this.velocity.add(this.acceleration)
	this.velocity.limit(this.topspeed)
	this.position.add(this.velocity)
}
Mover.prototype.draw = function () {
	fill(this.color)
	stroke(255)
	strokeWeight(3)

	rect(this.position.x, this.position.y, this.size, this.size)
}
Mover.prototype.isOffscreen = function () {
	return (
		this.position.x < 0 ||
		this.position.x + this.size > width ||
		this.position.y < 0 ||
		this.position.y + this.size > height
	)
}
