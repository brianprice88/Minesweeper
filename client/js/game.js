
var board; // board is initially undefined

var selectLevel = function (event) { // user selects level to play
    event.preventDefault();
    let level;
    if (event.target[0].checked) { level = 'Beginner' }
    else if (event.target[1].checked) { level = 'Intermediate' }
    else if (event.target[2].checked) { level = 'Expert' }
    document.getElementById('newGame').style.display = 'none' // hide the signup form
    document.getElementById('gameBoard').style.opacity = 1 // reveal the game board/stats/rules divs
    document.getElementById('gameRules').style.opacity = 1
    document.getElementById('gameStats').style.opacity = 1

    createBoard(level)

}

var createBoard = function (level) { // make the game board based on level
    let rows;
    let columns;
    let mines;
    let flags;
    switch (level) {
        case 'Beginner':
            rows = 9;
            columns = 9;
            mines = 10;
            flags = 10;
            break;
        case 'Intermediate':
            rows = 16;
            columns = 16;
            mines = 40;
            flags = 40;
            break;
        case 'Expert':
            rows = 16;
            columns = 30;
            mines = 99;
            flags = 99;
            break;
    }
    board = new Board (rows, columns, mines, flags)
    board.buildBoard();
    document.addEventListener('gameOver', (event) => endGame(event.detail)) // for when game is over
}


var endGame = function(result) {
    if (result === 'win') {
        alert ('you win!')
        // show mines
        // clear board
    } else {
        alert ('you lose!')
        // show remaining squares
        // clear board
    }
}


window.onload = () => {

    const form = document.getElementById('newGame');
    form.addEventListener('submit', selectLevel)

}

