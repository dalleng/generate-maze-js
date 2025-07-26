const CLOSED = 0;
const OPEN = 1;
const MAZE_GRID_SELECTOR = "#maze-grid";

function initializeMaze(size) {
  const maze = [];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (j === 0) maze.push([]);
      maze[i][j] = CLOSED;
    }
  }
  return maze;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function shuffle(arr) {
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(arr.length);
    const aux = arr[i];
    arr[i] = arr[j];
    arr[j] = aux;
  }
}

function* dfsMaze(maze, size, row, col) {
  const frontier = [[row, col]];
  const visited = new Set();
  visited.add(`${row},${col}`);

  while (frontier.length > 0) {
    const [currentRow, currentCol] = frontier.pop();
    const directionDiff = [[-1, 0], [0, 1], [1, 0], [0, -1]];

    maze[currentRow][currentCol] = OPEN;
    if (currentRow == size-1 && currentCol == size-1) {
      break;
    }

    for (let diff of directionDiff) {
      const [ rd, cd ] = diff;
      const newRow = currentRow + rd;
      const newCol = currentCol + cd;

      if (newRow < 0 || newCol < 0) continue;
      if (newRow > size-1 || newCol > size-1) continue;
      if (maze[newRow][newCol] === OPEN)  continue;
      if (visited.has(`${newRow},${newCol}`)) continue;

      yield; // so that we can suspend execution render the maze, and resume after.
      frontier.push([newRow, newCol]);
      visited.add(`${newRow},${newCol}`);
    }
  }
}

function renderMaze(maze) {
  const gridContainer = document.querySelector(MAZE_GRID_SELECTOR);
  for (let i = 0; i < maze.length; i++) {
    const row = document.createElement("div");
    row.className = "maze-row";
    gridContainer.appendChild(row);
    for (let j = 0; j < maze.length; j++) {
      const cell = document.createElement("div");
      cell.className = maze[i][j] == OPEN ? "maze-cell white" : "maze-cell black";
      row.appendChild(cell);
    }
  }
}

function clearMaze() {
    const gridContainer = document.querySelector(MAZE_GRID_SELECTOR);
    gridContainer.replaceChildren();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAndRenderStepByStep(size) {
  const maze = initializeMaze(size);
  const gen = dfsMaze(maze, size, 0, 0);
  let result = gen.next();
  while (!result.done) {
    renderMaze(maze);
    await sleep(10);
    result = gen.next();
    clearMaze();
  }
  renderMaze(maze);
}

document.addEventListener("DOMContentLoaded", () => {
  generateAndRenderStepByStep(30);
});