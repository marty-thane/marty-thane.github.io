const FONT = "30px monospace"
const COLOR_FONT = "lime"
const COLOR_BG = "black"
const COLOR_SNAKE = "white"
const COLOR_FOOD = "red"

const COLS = 20
const ROWS = 15
const SIZE = 30
const RATE = 10

const canvas = document.getElementById("canvas")
const beep = document.getElementById("beep")
const boop = document.getElementById("boop")
const ctx = canvas.getContext("2d")

canvas.width = COLS * SIZE
canvas.height = ROWS * SIZE

let pos, vel, food, snake, score

beep.volume = 0.5
boop.volume = 0.5

function init() {
	score = 0

	pos = {x: 2, y: 1}
	vel = {x: 0, y: 0}

	snake = [
		{x: 1, y: 1},
		{x: 2, y: 1},
	]

	spawnFood()
}

init()

function spawnFood() {
	food = {
		x: Math.floor(Math.random() * (COLS - 1)),
		y: Math.floor(Math.random() * (ROWS - 1)),
	}

	// redo if spawned inside of snake
	for (let cell of snake) {
		if (cell.x === food.x && cell.y === food.y) {
			return spawnFood()
		}
	}
}

document.addEventListener("keydown", keyPressed)

function keyPressed(event) {
	switch (event.keyCode) {
		case 37: return updateVel({x: -1, y: 0})
		case 38: return updateVel({x: 0, y: -1})
		case 39: return updateVel({x: 1, y: 0})
		case 40: return updateVel({x: 0, y: 1})
	}
}

function updateVel(dir) {
	// do not allow the player to go backwards
	if (dir.x === -vel.x && dir.y === -vel.y) {
		return
	}
	vel.x = dir.x
	vel.y = dir.y
}

setInterval(() => {
	requestAnimationFrame(gameLoop)
}, 1000 / RATE)

function gameLoop() {
	ctx.fillStyle = COLOR_BG
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.fillStyle = COLOR_FOOD
	ctx.fillRect(food.x * SIZE, food.y * SIZE, SIZE, SIZE)

	ctx.fillStyle = COLOR_SNAKE
	for (let cell of snake) {
		ctx.fillRect(cell.x * SIZE, cell.y * SIZE, SIZE, SIZE)
	}

	ctx.font = FONT
	ctx.fillStyle = COLOR_FONT
	ctx.fillText(score, 6, 31)

	// move the snake
	pos.x += vel.x
	pos.y += vel.y

	// wrap around the edges
	if (pos.x < 0) {
		pos.x = COLS - 1
	} else if (pos.x > COLS - 1) {
		pos.x = 0
	} else if (pos.y < 0) {
		pos.y = ROWS - 1
	} else if (pos.y > ROWS - 1) {
		pos.y = 0
	}

	// eat food
	if (food.x === pos.x && food.y === pos.y) {
		snake.push({...pos})
		pos.x += vel.x
		pos.y += vel.y
		score += 1
		beep.play()
		spawnFood()
	}

	// if moving
	if (vel.x || vel.y) {
		for (let cell of snake) {
			// reset if colliding with itself
			if (cell.x === pos.x && cell.y === pos.y) {
				boop.play()
				return init()
			}
		}
		snake.push({...pos})
		snake.shift()
	}
}
