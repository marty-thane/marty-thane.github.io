# John Conway's Game of Life implemented with Pygame.

import os
os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = "hide"
import pygame
import numpy as np
import argparse

COLOR_BG = (66, 72, 116)
COLOR_ALIVE = (244, 238, 255)
COLOR_DIE_NEXT = (166, 177, 225)

DEFAULT_COLS = 40
DEFAULT_ROWS = 30
DEFAULT_SIZE = 20
DEFAULT_RATE = 15


def update(screen, cells, size, with_progress=False):
    updated_cells = np.zeros((cells.shape[0], cells.shape[1]))

    for col, row in np.ndindex(cells.shape):
        alive = np.sum(cells[col-1:col+2, row-1:row+2]) - cells[col, row]
        color = COLOR_BG if cells[col, row] == 0 else COLOR_ALIVE

        if cells[col, row] == 1:
            if alive < 2 or alive > 3:
                if with_progress:
                    color = COLOR_DIE_NEXT
            elif 2 <= alive <= 3:
                updated_cells[col, row] = 1
                if with_progress:
                    color = COLOR_ALIVE
        else:
            if alive == 3:
                updated_cells[col, row] = 1
                if with_progress:
                    color = COLOR_ALIVE

        pygame.draw.rect(screen, color, (col * size, row * size, size, size))

    return updated_cells


def main():
    pygame.init()
    screen = pygame.display.set_mode((COLS * SIZE, ROWS * SIZE))
    clock = pygame.time.Clock()

    cells = np.zeros((COLS, ROWS))

    update(screen, cells, SIZE)
    pygame.display.update()

    running = False

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    running = not running
                    update(screen, cells, SIZE)
                    pygame.display.update()
            if pygame.mouse.get_pressed()[0]:
                pos = pygame.mouse.get_pos()
                cells[pos[0] // SIZE, pos[1] // SIZE] = 1
                update(screen, cells, SIZE)
                pygame.display.update()

        if running:
            cells = update(screen, cells, SIZE, with_progress=True)
            pygame.display.update()
            clock.tick(RATE)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="John Conway's Game of Life implemented with Pygame.")
    parser.add_argument("--cols", type=int, default=DEFAULT_COLS,
                        help=f"number of columns (default: {DEFAULT_COLS})")
    parser.add_argument("--rows", type=int, default=DEFAULT_ROWS,
                        help=f"number of rows (default: {DEFAULT_ROWS})")
    parser.add_argument("--size", type=int, default=DEFAULT_SIZE,
                        help=f"size of each cell in pixels (default: {DEFAULT_SIZE})")
    parser.add_argument("--rate", type=int, default=DEFAULT_RATE,
                        help=f"speed of the simulation (default: {DEFAULT_RATE})")

    args = parser.parse_args()

    COLS = args.cols
    ROWS = args.rows
    SIZE = args.size
    RATE = args.rate

    main()
