const BOID_SIZE = 4
const BOID_SPEED = 3.5
const BOID_SIGHT = 80
const MARGIN = 70
const SEPARATION_FORCE = 2
const COHESION_FORCE = 0.015
const ALIGNMENT_FORCE = 0.018
const EDGE_FORCE = 0.008
const JITTER_FORCE = 0.08

const BG_COLOR = "#161A30"
const BOID_COLOR = "#917197"
const TEXT_COLOR = "#A9AABC"

const FPS = 60

let separation = true
let cohesion = true
let alignment = true

let flock = []

function setup() {
	createCanvas(800, 600)
}

function draw() {
	background(BG_COLOR)
	frameRate(FPS)
	noStroke()

	// spawn new boids
	if (mouseIsPressed && mouseButton == LEFT) {
		flock.push(new Boid(mouseX, mouseY))
	}

	for (let boid of flock) {
		let neighbors = getNeighbors(boid)
		if (neighbors.length > 0) {
			if (separation) boid.separate(neighbors)
			if (cohesion) boid.cohere(neighbors)
			if (alignment) boid.align(neighbors)
		}
		boid.avoidEdges()
		boid.jitter()
		boid.move()
		boid.draw()
	}

	fill(TEXT_COLOR)
	text("controls: (s)eparation | (c)ohesion | (a)lignment", 8, height - 10)
}

// toggle flocking behavior via keyboard
function keyPressed() {
	if (key === "s" || key === "S") {
		separation = !separation
	} else if (key === "c" || key === "C") {
		cohesion = !cohesion
	} else if (key === "a" || key === "A") {
		alignment = !alignment
	}
}

// get nearby boids as an array
function getNeighbors(boid) {
	let neighbors = []
	for (let n of flock) {
		if (n.pos.dist(boid.pos) < BOID_SIGHT && n != boid) {
			neighbors.push(n)
		}
	}
	return neighbors
}

// multiply each item in an array by some number
function multiply(arr, num) {
	let multiplied = []
	for (let item of arr) {
		multiplied.push(item * num)
	}
	return multiplied
}

class Boid {
	constructor(x, y) {
		this.pos = createVector(x, y)
		this.vel = p5.Vector.random2D().setMag(BOID_SPEED) // initial velocity
	}

	separate(neighbors) {
		let v = createVector()
		for (let n of neighbors) {
			let d = p5.Vector.sub(this.pos, n.pos)
			v.add(d.setMag(1 / d.mag())) // force inversely proportional to distance
		}
		v.mult(SEPARATION_FORCE)
		this.vel.add(v)
	}

	cohere(neighbors) {
		let v = createVector()
		for (let n of neighbors) {
			v.add(n.pos)
		}
		v.div(neighbors.length)
		v.sub(this.pos) // relative to this.pos
		v.mult(COHESION_FORCE)
		this.vel.add(v)
	}

	align(neighbors) {
		let v = createVector()
		for (let n of neighbors) {
			v.add(n.vel)
		}
		v.div(neighbors.length)
		v.mult(ALIGNMENT_FORCE)
		this.vel.add(v)
	}

	avoidEdges() {
		let v = createVector()
		// force proportional to how far the boid has wandered off
		if (this.pos.x < MARGIN) {
			v.add(MARGIN - this.pos.x, 0)
		}
		else if (this.pos.x > width - MARGIN) {
			v.add(width - MARGIN - this.pos.x, 0)
		}
		if (this.pos.y < MARGIN) {
			v.add(0, MARGIN - this.pos.y)
		}
		else if (this.pos.y > height - MARGIN) {
			v.add(0, height - MARGIN - this.pos.y)
		}
		v.mult(EDGE_FORCE)
		this.vel.add(v)
	}

	jitter() {
		let v = p5.Vector.random2D()
		v.mult(JITTER_FORCE)
		this.vel.add(v)
	}

	move() {
		this.vel.limit(BOID_SPEED)
		this.pos.add(this.vel)
	}

	draw() {
		fill(BOID_COLOR)
		let angle = this.vel.heading() + PI/2
		push()
		translate(this.pos.x, this.pos.y)
		rotate(angle)
		beginShape()
			vertex(0, -(BOID_SIZE + 1))
			vertex(-BOID_SIZE, BOID_SIZE)
			vertex(BOID_SIZE, BOID_SIZE)
		endShape(CLOSE)
		pop()
	}
}
