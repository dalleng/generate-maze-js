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
  while (frontier.length > 0) {
    const [currentRow, currentCol] = frontier.pop();

    const directionDiff = [[-2, 0], [0, 2], [2, 0], [0, -2]];
    shuffle(directionDiff);

    for (let diff of directionDiff) {
      const [ rd, cd ] = diff;
      const newRow = currentRow + rd;
      const newCol = currentCol + cd;

      if (newRow < 0 || newCol < 0) continue;
      if (newRow > size-1 || newCol > size-1) continue;
      if (maze[newRow][newCol] === OPEN)  continue;

      maze[currentRow][currentCol] = OPEN;
      maze[newRow][newCol] = OPEN;
      maze[(currentRow + newRow) / 2][(currentCol + newCol) / 2] = OPEN;

      // deal with mazes where size is an even number
      // assumes exit is in (size-1, size-1)
      if (size % 2 == 0 && newCol == size-2 && newRow == size-2) {
        maze[size-1][size-1] = OPEN;
        const diff = [[0, 1], [1, 0]][getRandomInt(2)];
        maze[newRow+diff[0]][newCol+diff[1]] = OPEN;
      }

      yield;
      frontier.push([newRow, newCol]);
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
    await sleep(50);
    result = gen.next();
    if (!result.done) clearMaze();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const sizeSelect = document.querySelector("#maze-size");
  sizeSelect.addEventListener("change", async (e) => {
    clearMaze();
    sizeSelect.setAttribute("disabled", "disabled");
    await generateAndRenderStepByStep(parseInt(sizeSelect.value));
    sizeSelect.removeAttribute("disabled");
  });
  sizeSelect.setAttribute("disabled", "disabled");
  await generateAndRenderStepByStep(parseInt(sizeSelect.value));
  sizeSelect.removeAttribute("disabled");
});