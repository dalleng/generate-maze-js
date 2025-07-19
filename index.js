const CLOSED = 0;
const OPEN = 1;
const MAZE_GRID_SELECTOR = "#maze-grid";

function initializeMaze(size) {
  const maze = [];
  for (i = 0; i < size; i++) {
    for (j = 0; j < size; j++) {
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
  for (i = 0; i < arr.length; i++) {
    j = getRandomInt(arr.length);
    aux = arr[i];
    arr[i] = arr[j];
    arr[j] = aux;
  }
}

function generateMaze(size) {
  const maze = initializeMaze(size);
  function dfs(row, col) {
    const directionDiff = [[-2, 0], [0, 2], [2, 0], [0, -2]];
    shuffle(directionDiff);
    console.log(directionDiff);
    for (diff of directionDiff) {
      const [ rd, cd ] = diff;
      const newRow = row + rd;
      const newCol = col + cd;
      if (newRow < 0 || newCol < 0) continue;
      if (newRow > size-1 || newCol > size-1) continue;
      if (maze[newRow][newCol] === OPEN)  continue;
      maze[row][col] = OPEN;
      maze[newRow][newCol] = OPEN;
      maze[(row + newRow) / 2][(col + newCol) / 2] = OPEN;
      dfs(newRow, newCol);
    }
  }
  dfs(0, 0);
  return maze;
}

function renderMaze(maze) {
  const gridContainer = document.querySelector(MAZE_GRID_SELECTOR);
  for (i = 0; i < maze.length; i++) {
    const row = document.createElement("div");
    row.className = "maze-row";
    gridContainer.appendChild(row);
    for (j = 0; j < maze.length; j++) {
      const cell = document.createElement("div");
      cell.className = maze[i][j] == OPEN ? "maze-cell white" : "maze-cell black";
      row.appendChild(cell);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const sizeSelect = document.querySelector("#maze-size");
  const gridContainer = document.querySelector(MAZE_GRID_SELECTOR);
  sizeSelect.addEventListener("change", (e) => {
    gridContainer.innerHTML = "";
    renderMaze(generateMaze(e.target.value));
  });
  renderMaze(generateMaze(parseInt(sizeSelect.value)));
});