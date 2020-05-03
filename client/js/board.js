class Board {

    constructor(rows, columns, mines, flags) {
        this.rows = rows;
        this.columns = columns;
        this.mines = mines;
        this.flags = flags;
    }

    buildBoard() {
        var gameBoard = document.getElementById('gameBoard') // make board the right number of rows and columns
        const gridRowStyle = '40px '.repeat(this.rows)
        const gridColumnStyle = '40px '.repeat(this.columns)
        gameBoard.style.gridTemplateColumns = gridColumnStyle
        gameBoard.style.gridTemplateRows = gridRowStyle

        for (var i = 0; i < this.rows; i++) { // add appropriate number of cells
            for (var j = 0; j < this.columns; j++) {
                var element = document.createElement('div')
                element.classList.add('cell')
                element.innerHTML = `r${i} c${j}`
                gameBoard.append(element)
            }
        }
    }

}

