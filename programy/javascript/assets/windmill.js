const WIDTH = 800
const HEIGHT = 600
const FPS = 60
const DIST_TRESHOLD = 3 // prevent missing a point
const FRAME_TRESHOLD = 6 // prevent snapping back and forth
const SPEED = 0.015

let points = []
let windmill
let click

function preload() {
	click = new Audio("assets/click.wav")
	click.load()
}

function setup() {
	game = createCanvas(WIDTH, HEIGHT)
	game.canvas.style = "" // clear defaults, use page css instead

	let p = new Point(width/2, height/2)
	points.push(p)

	windmill = new Mill(width/2, height/2)
}

function draw() {
	background(0)
	frameRate(FPS)

	windmill.rotate()
	windmill.draw()

	for (let p of points) {
		p.draw()
		if (isColliding(windmill, p) && frameCount > FRAME_TRESHOLD) {
			playSound(click)
			windmill.x = p.x
			windmill.y = p.y
			p.score += 1
			frameCount = 0
		}
	}
}

// spawn new points
function mousePressed() {
	// proceed only if click inside of canvas
	if (isBetween(mouseX, 0, width) && isBetween(mouseY, 0, height)) {
		let p = new Point(mouseX, mouseY)
		points.push(p)
	}
}

function isBetween(num, min, max) {
    return ((num-min)*(num-max) <= 0);
}

function isColliding(ln, p) {
	// do not proceed if already switched to that point
	if (ln.x == p.x && ln.y == p.y) {
		return false
	}

    let x1 = ln.coords[0]
    let y1 = ln.coords[1]
    let x2 = ln.coords[2]
    let y2 = ln.coords[3]

	// calculate the distance using a formula
    let d = abs((x2 - x1) * (y1 - p.y) - (x1 - p.x) * (y2 - y1)) / dist(x1, y1, x2, y2)

    return d <= DIST_TRESHOLD;
}

function playSound(audio) {
  let sound = audio.cloneNode()
  sound.play()
}

class Point {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.score = 0
	}

	draw() {
		stroke("white")
		strokeWeight(5)
		point(this.x, this.y)
		strokeWeight(0)
		fill(255)
		text(this.score, this.x + 5, this.y + 13)
	}
}

class Mill {
	constructor(x, y) {
		this.x = x // axis around which to rotate
		this.y = y
		this.coords = [] // x1, x2, y1, y2
		this.angle = 0
		this.length = dist(0, 0, width, height) // make sure the line always exceeds the canvas
	}

	rotate() {
		if (this.angle > PI) {
			this.angle -= PI // limit the angle value
		}
		this.angle += SPEED

		let vx = cos(this.angle) * this.length
		let vy = sin(this.angle) * this.length
		this.coords = [
			this.x - vx,
			this.y - vy,
			this.x + vx,
			this.y + vy,
		]
	}

	draw() {
		stroke("red")
		strokeWeight(1)
		line(
			this.coords[0],
			this.coords[1],
			this.coords[2],
			this.coords[3],
		)
	}
}
