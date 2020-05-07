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
        var gameBoard = document.getElementById('gameBoard')
        const gridRowStyle = '40px '.repeat(this.rows)
        const gridColumnStyle = '40px '.repeat(this.columns)
        gameBoard.style.gridTemplateColumns = gridColumnStyle
        gameBoard.style.gridTemplateRows = gridRowStyle
        var flagCount = document.getElementById('flagsRemaining')
        flagCount.innerHTML = this.flags;
        flagCount.classList.add('Orbitron')
        var mineCount = document.getElementById('minesOnBoard')
        mineCount.innerHTML = this.mines
        mineCount.classList.add('Orbitron')
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                var element = document.createElement('div')
                element.classList.add('cell')
                element.setAttribute('id', `${i},${j}`)
                gameBoard.append(element);
                var cell = { hasMine: false, hasFlag: false, isTurnedOver: false, row: i, column: j, adjacentMines: 0 };
                this.cells[i][j] = cell
            }
        }
    }

    triggerCell(event) {
        if (event.target.id === 'gameBoard') { return } // avoid console error message from clicking outside the cells
        const target = event.target.id;
        const targetRow = parseInt(target.split(',')[0]);
        const targetColumn = parseInt(target.split(',')[1])
        const targetCell = this.cells[targetRow][targetColumn]
        if (event.which === 1) {
            this.turnOverCell(targetCell)
        } else if (event.which === 3) {
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
            else if (!cell.hasFlag && !cell.isTurnedOver) {
                if (cell.hasMine) {
                    document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'red'
                    const event = new CustomEvent('gameOver', { detail: "lose" })
                    document.dispatchEvent(event)
                }
                else {
                    if (this.cellsRevealed + 1 === (this.rows * this.columns) - this.mines) {
                        const event = new CustomEvent('gameOver', { detail: "win" })
                        document.dispatchEvent(event)
                    } else {
                        this.cellsRevealed++;
                        cell.isTurnedOver = true;
                        if (cell.adjacentMines > 0) {
                            var mines = document.createElement('p');
                            mines.setAttribute('class', 'adjacentMines')
                            mines.setAttribute('id', `${cell.row},${cell.column}`) // this is to avoid an error if user clicked on the added number itself
                            mines.innerHTML = cell.adjacentMines;
                            mines.classList.add('Orbitron')
                            document.getElementById(`${cell.row},${cell.column}`).append(mines)
                        } else if (cell.adjacentMines === 0) {
                            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'green'
                            this.checkAdjacentCells(cell.row, cell.column)
                        }
                    }
                }
            }
        }
        else if (gameHasEnded) {
            if (cell.hasMine) {
                document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'red'
            } else {
                if (cell.adjacentMines > 0) {
                    if (document.getElementById(`${cell.row},${cell.column}`).childNodes.length === 0) { // don't append number if it was already added
                        var mines = document.createElement('p');
                        mines.setAttribute('class', 'adjacentMines')
                        mines.classList.add('Orbitron')
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

    checkAdjacentCells(i, j) {
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
            if (!cell.hasFlag && this.flags > 0 && !cell.isTurnedOver) {
                cell.hasFlag = true;
                this.flags = this.flags - 1;
                document.getElementById('flagsRemaining').innerHTML = this.flags;
                document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'blue'
            } else if (cell.hasFlag) {
                cell.hasFlag = false;
                this.flags = this.flags + 1;
                document.getElementById('flagsRemaining').innerHTML = this.flags;
                document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = '#d9d9d9'
            }
        }
    }

    placeMines(cell) {
        var minesToPlace = this.mines;
        while (minesToPlace > 0) {
            var randomRow = Math.floor(Math.random() * this.rows);
            var randomColumn = Math.floor(Math.random() * this.columns);
            if (Math.abs(randomRow - cell.row) > 1 && Math.abs(randomColumn - cell.column) > 1) { // don't place mine on the clicked square or adjacent to it
                var randomSquare = this.cells[randomRow][randomColumn];
                if (!randomSquare.hasMine) {
                    randomSquare.hasMine = true;
                    minesToPlace--
                }
            }
        }
        this.getAdjacentMines();
    }

    getAdjacentMines() {
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
