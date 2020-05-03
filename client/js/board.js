class Board {

    constructor(rows, columns, mines, flags) {
        this.rows = rows;
        this.columns = columns;
        this.mines = mines;
        this.flags = flags;
        this.cells = new Array(this.rows).fill([]).map(row => new Array(this.columns).fill(null))
    }

    buildBoard() {
        var gameBoard = document.getElementById('gameBoard') // make board the right number of rows and columns
        const gridRowStyle = '40px '.repeat(this.rows)
        const gridColumnStyle = '40px '.repeat(this.columns)
        gameBoard.style.gridTemplateColumns = gridColumnStyle
        gameBoard.style.gridTemplateRows = gridRowStyle

        for (var i = 0; i < this.rows; i++) { // add appropriate number of cells to board, and new Cell instance to cells array
            for (var j = 0; j < this.columns; j++) {
                var element = document.createElement('div')
                element.classList.add('cell')
                element.setAttribute('id', `${i},${j}`) // id reference so we can access this element later to change bg color
                gameBoard.append(element);
                var cell = {hasMine: false, hasFlag: false, isTurnedOver: false}; // cells initially start out without mine/flag/not turned over
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
    if (!cell.hasFlag && !cell.isTurnedOver) { // only turn square over if there isn't a flag and it hasn't already been turned over
        if (cell.hasMine) {
           // TURN SQUARE RED/SHOW MINE AND END GAME    
        }
        else {
            cell.isTurnedOver = true;
            console.log(cell)
            // TURN SQUARE OTHER COLOR AND RUN FUNCTION TO CHECK ADJACENT SQUARES
        }
    }
    }

    plantFlag(cell) {
    if (!cell.hasFlag) { // plant a flag if there isn't already one there
        cell.hasFlag = true
    }
    // NEED TO VISUALLY SHOW FLAG PLACED THERE
    }
}
