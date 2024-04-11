const FONT = "30px monospace"
const COLOR_FONT = "lime"
const COLOR_BG = "black"
const COLOR_BIRD = "red"
const COLOR_WALL = "white"

// display settings
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 450
const BLOCK_SIZE = 30
const REFRESH_RATE = 60

const WALL_SPEED = 3
const WALL_DENSITY = 0.5 // n walls per second
const WALL_MAX_OFFSET = 5 // in blocks in each direction
const WALL_GAP = BLOCK_SIZE * 2 // size of the wall entrance

// player constants
const GRAVITY = 0.6
const JUMP_FORCE = 9
const MARGIN = BLOCK_SIZE * 2 // how far offscreen the player is allowed to go

const canvas = document.getElementById("canvas")
const beep = document.getElementById("beep")
const boop = document.getElementById("boop")
const ctx = canvas.getContext("2d")

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

let pos, vel, score
let walls, wallInterval

beep.volume = 0.5
boop.volume = 0.5

function init() {
	score = 0
	if (wallInterval) {
		clearInterval(wallInterval)
	}

	pos = {x: CANVAS_WIDTH / 5, y: CANVAS_HEIGHT / 5}
	vel = {y: 0}
	
	walls = []

	spawnWall()
	wallInterval = setInterval(() => {
		spawnWall()
	}, 1000 / WALL_DENSITY)

}

init()

function spawnWall() {
	let middle = Math.floor((CANVAS_HEIGHT / BLOCK_SIZE) / 2) * BLOCK_SIZE
	let offset = Math.floor((Math.random() - Math.random()) * WALL_MAX_OFFSET) * BLOCK_SIZE
	wall_instance = {
		x: CANVAS_WIDTH,
		y: middle + offset,
	}
	walls.push({...wall_instance})
}

// jump if key pressed
document.addEventListener("keydown", (event) => {
	if (event.keyCode == 32) {
		vel.y = -JUMP_FORCE
	}
})

setInterval(() => {
	requestAnimationFrame(process)
}, 1000 / REFRESH_RATE)

function process() {
	ctx.fillStyle = COLOR_BG
	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

	for (let wall of walls) {
		ctx.fillStyle = COLOR_WALL
		ctx.fillRect(wall.x, 0, BLOCK_SIZE, CANVAS_HEIGHT)

		// draw the passage between the walls
		ctx.fillStyle = COLOR_BG
		ctx.fillRect(wall.x, wall.y - WALL_GAP, BLOCK_SIZE, (WALL_GAP * 2) + BLOCK_SIZE)
	}

	ctx.fillStyle = COLOR_BIRD
	ctx.fillRect(pos.x, pos.y, BLOCK_SIZE, BLOCK_SIZE)

	ctx.font = FONT
	ctx.fillStyle = COLOR_FONT
	ctx.fillText(score, 6, 31)

	// make the bird fly
	pos.y += vel.y
	vel.y += GRAVITY

	// reset if bird left the screen
	if (pos.y < -MARGIN || pos.y > CANVAS_HEIGHT + MARGIN) {
		boop.play()
		return init()
	}

	// logic for walls
	for (wall of walls) {
		wall.x -= WALL_SPEED

		// despawn if out of sight
		if (wall.x < -BLOCK_SIZE) {
			walls.shift()
			continue
		}

		// if bird inside of wall
		if (pos.x <= wall.x + BLOCK_SIZE && pos.x >= wall.x - BLOCK_SIZE) {
			// reset if colliding
			if (pos.y <= wall.y - WALL_GAP || pos.y >= wall.y + WALL_GAP) {
				boop.play()
				return init()
			}
			// score points if gone through
			if (pos.x == wall.x) {
				beep.play()
				score += 1
			}
		}
	}
}
