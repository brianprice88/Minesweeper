class Board {

    constructor(rows, columns, mines, flags) {
        this.rows = rows;
        this.columns = columns;
        this.mines = mines;
        this.flags = flags;
        this.cells = new Array(this.rows).fill([]).map(row => new Array(this.columns).fill(null));
        this.cellsRevealed = 0;
    }

    buildBoard() {
        var gameBoard = document.getElementById('gameBoard') // make board the right number of rows and columns
        const gridRowStyle = '40px '.repeat(this.rows)
        const gridColumnStyle = '40px '.repeat(this.columns)
        gameBoard.style.gridTemplateColumns = gridColumnStyle
        gameBoard.style.gridTemplateRows = gridRowStyle

        var flagCount = document.getElementById('flagsRemaining')
        flagCount.innerHTML = this.flags;
        var mineCount = document.getElementById('minesOnBoard')
        mineCount.innerHTML = this.mines

        for (var i = 0; i < this.rows; i++) { // add appropriate number of cells to board, and new Cell instance to cells array
            for (var j = 0; j < this.columns; j++) {
                var element = document.createElement('div')
                element.classList.add('cell')
                element.setAttribute('id', `${i},${j}`) // id reference so we can access this element later to change bg color
                gameBoard.append(element);
                var cell = { hasMine: false, hasFlag: false, isTurnedOver: false, row: i, column: j, adjacentMines: 0 }; // cells initially start out without mine/flag/not turned over
                this.cells[i][j] = cell // add cell to cells array so we can update game stats etc
            }
        }
        gameBoard.addEventListener('mousedown', (event) => this.triggerCell(event)) // event listener for when a cell is clicked
    }

    triggerCell(event) {
        if (event.target.id === 'gameBoard') {return} // avoid console error message from clicking outside the cells
        var target = event.target.id;
        var targetRow = parseInt(target.split(',')[0]);
        var targetColumn = parseInt(target.split(',')[1])
        var targetCell = this.cells[targetRow][targetColumn] // determine the cell in this.cells that was clicked
        if (event.which === 1) { // left click = turn over cell
            this.turnOverCell(targetCell)
        } else if (event.which === 3) { // right click = plant flag
            this.plantFlag(targetCell)
        }
    }

    turnOverCell(cell) {
      if (!gameHasEnded) {
        if (this.cellsRevealed === 0) { //player's first click: plant mines, check adjacent cells
            this.placeMines(cell)
            cell.isTurnedOver = true;
            this.cellsRevealed++;
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'green'
            this.checkAdjacentCells(cell.row, cell.column)
        }
        else if (!cell.hasFlag && !cell.isTurnedOver) { // on subsequent clicks, player has to pick a square without a flag and that hasn't already been turned over
            if (cell.hasMine) { // player uncovers a mine = game over
                document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'red'
                var event = new CustomEvent('gameOver', { detail: "lose" })
                document.dispatchEvent(event)
            }
            else {
                if (this.cellsRevealed + 1 === (this.rows * this.columns) - this.mines) { //all cells besides mines revealed = player wins
                    var event = new CustomEvent('gameOver', { detail: "win" })
                    document.dispatchEvent(event)
                } else {
                    this.cellsRevealed++;
                    cell.isTurnedOver = true;
                    if (cell.adjacentMines > 0) { // show number of adjacent mines in square
                        var mines = document.createElement('p');
                        mines.setAttribute('class', 'adjacentMines')
                        mines.setAttribute('id', `${cell.row},${cell.column}`) // this is to avoid an error if user clicked on the added number
                        mines.innerHTML = cell.adjacentMines;
                        document.getElementById(`${cell.row},${cell.column}`).append(mines)
                    } else if (cell.adjacentMines === 0) { // if no adjacent mines, turn cell green and check adjacent cells
                        document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'green'
                        this.checkAdjacentCells(cell.row, cell.column)
                    }
                }
            }
        }
    } 
    else { //if game is over, display the square no matter what
        if (cell.hasMine) {
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'red'
    } else {
        if (cell.adjacentMines > 0) { // show number of adjacent mines in square
            if (document.getElementById(`${cell.row},${cell.column}`).childNodes.length === 0) { // don't append number if it was already added
            var mines = document.createElement('p');
            mines.setAttribute('class', 'adjacentMines')
            mines.setAttribute('id', `${cell.row},${cell.column}`) 
            mines.innerHTML = cell.adjacentMines;
            document.getElementById(`${cell.row},${cell.column}`).append(mines)
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = '#d9d9d9'
            }
      } else {
        document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'green'
    }
      }
    }

    }

    checkAdjacentCells(i, j) { // check adjacent cells (if they exist) for if they have mines    
        if (this.cells[i - 1] && this.cells[i - 1][j - 1]) {
            this.turnOverCell(this.cells[i - 1][j - 1])
        }
        if (this.cells[i - 1]) {
            this.turnOverCell(this.cells[i - 1][j])
        }
        if (this.cells[i - 1] && this.cells[i - 1][j + 1]) {
            this.turnOverCell(this.cells[i - 1][j + 1])
        }
        if (this.cells[i][j - 1]) {
            this.turnOverCell(this.cells[i][j - 1])
        }
        if (this.cells[i][j + 1]) {
            this.turnOverCell(this.cells[i][j + 1])
        }
        if (this.cells[i + 1] && this.cells[i + 1][j - 1]) {
            this.turnOverCell(this.cells[i + 1][j - 1])
        }
        if (this.cells[i + 1]) {
            this.turnOverCell(this.cells[i + 1][j])
        }
        if (this.cells[i + 1] && this.cells[i + 1][j + 1]) {
            this.turnOverCell(this.cells[i + 1][j + 1])
        }
    }

    plantFlag(cell) {
        if (!gameHasEnded) {
        if (!cell.hasFlag && this.flags > 0) { // plant a flag if there isn't already one there and if player has at least 1 flag left
            cell.hasFlag = true;
            this.flags--
            document.getElementById('flagsRemaining').innerHTML = this.flags;
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'blue'
        } else if (cell.hasFlag) { // remove a flag if player clicks on cell with flag already there
            cell.hasFlag = false;
            this.flags++;
            document.getElementById('flagsRemaining').innerHTML = this.flags;
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = '#d9d9d9'
        }
    }
    }

    placeMines(cell) { // place mines after first user click, so don't put a mine on that square
        var minesToPlace = this.mines;
        while (minesToPlace > 0) {
            var randomRow = Math.floor(Math.random() * this.rows);
            var randomColumn = Math.floor(Math.random() * this.columns);
            if (Math.abs(randomRow - cell.row) > 1 && Math.abs(randomColumn - cell.column) > 1) { // don't place mine on the clicked square or adjacent to it
                var randomSquare = this.cells[randomRow][randomColumn];
                if (!randomSquare.hasMine) { // only place mine if there isn't already a mine
                    randomSquare.hasMine = true;
                    minesToPlace--
                }
            }
        }
        this.getAdjacentMines(); // now figure out all cells' adjacent mines
    }

    getAdjacentMines() { // determine adjacent mines for each cell
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                if (this.cells[i][j].hasMine) {
                    continue;
                } else {
                    if (this.cells[i - 1] && this.cells[i - 1][j - 1] && this.cells[i - 1][j - 1].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i - 1] && this.cells[i - 1][j].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i - 1] && this.cells[i - 1][j + 1] && this.cells[i - 1][j + 1].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i][j - 1] && this.cells[i][j - 1].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i][j + 1] && this.cells[i][j + 1].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i + 1] && this.cells[i + 1][j - 1] && this.cells[i + 1][j - 1].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i + 1] && this.cells[i + 1][j].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                    if (this.cells[i + 1] && this.cells[i + 1][j + 1] && this.cells[i + 1][j + 1].hasMine) {
                        this.cells[i][j].adjacentMines = this.cells[i][j].adjacentMines + 1
                    }
                }
            }
        }
    }

}
