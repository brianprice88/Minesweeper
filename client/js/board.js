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
                var cell = { hasMine: false, hasFlag: false, isTurnedOver: false, row: i, column: j }; // cells initially start out without mine/flag/not turned over
                this.cells[i][j] = cell // add cell to cells array so we can update game stats etc
            }
        }
        gameBoard.addEventListener('mousedown', (event) => this.triggerCell(event)) // event listener for when a cell is clicked

    }

    triggerCell(event) {
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
        if (this.cellsRevealed === 0) { //player's first click: plant mines
            this.placeMines(cell)
            cell.isTurnedOver = true;
            this.cellsRevealed++;
            // reveal adjacent cells
        }

        else if (!cell.hasFlag && !cell.isTurnedOver) { // on subsequent clicks, player has to pick a square without a flag and that hasn't already been turned over
            if (cell.hasMine) {
                document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'red'
                alert('mine')
                // END GAME: LOSER 
            }
            else {
                cell.isTurnedOver = true;
                this.cellsRevealed++;
                if (this.cellsRevealed === (this.rows * this.columns) - this.mines) {
                    // END GAME: WINNER
                }
                // otherwise check this cell's adjacent squares
                // TURN SQUARE OTHER COLOR AND RUN FUNCTION TO CHECK ADJACENT SQUARES
            }
        }

    }

    plantFlag(cell) {
        if (!cell.hasFlag && this.flags > 0) { // plant a flag if there isn't already one there and if player has at least 1 flag left
            cell.hasFlag = true;
            this.flags --
            document.getElementById('flagsRemaining').innerHTML = Number(document.getElementById('flagsRemaining').innerHTML) - 1;
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = 'blue'
        } else if (cell.hasFlag) { // remove a flag if player clicks on cell with flag already there
            cell.hasFlag = false;
            this.flags ++;
            document.getElementById('flagsRemaining').innerHTML = Number(document.getElementById('flagsRemaining').innerHTML) + 1;
            document.getElementById(`${cell.row},${cell.column}`).style.backgroundColor = '#d9d9d9'
        }
    }

    placeMines(cell) { // place mines after first user click, so don't put a mine on that square
        var minesToPlace = this.mines;
        while (minesToPlace > 0) {
            var randomRow = Math.floor(Math.random() * this.rows);
            var randomColumn = Math.floor(Math.random() * this.columns);
            if (randomRow !== cell.row && randomColumn !== cell.column) {
                var randomSquare = this.cells[randomRow][randomColumn];
                if (!randomSquare.hasMine) {
                    randomSquare.hasMine = true;
                    minesToPlace--
                }
            }
        }
    }

}
