
var board; // board is initially undefined
var gameHasEnded = false; // will be used to run game end function just once

var loadHighScores = function() { // TO DO
    // use fetch to get high scores
    // also need to post new high score if user gets high score
    // and add timer showing what's elapsed
}

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
    board = new Board(rows, columns, mines, flags)
    board.buildBoard();
    document.getElementById('gameBoard').addEventListener('mousedown', (event) => board.triggerCell(event))
}


var endGame = function (result) {
    if (!gameHasEnded) {
        gameHasEnded = true;
        for (var i = 0; i < board.cells.length; i++) {
            for (var j = 0; j < board.cells[i].length; j++) {
                if (!board.cells[i][j].isTurnedOver) {
                    board.turnOverCell(board.cells[i][j])
                }
            }
        }        
        document.getElementById('gameOver').style.display = 'block' // reveal end of game modal
        var endMessage = document.createElement('h1')
        endMessage.setAttribute('id', 'endMessage')
        if (result === 'win') {
        endMessage.innerHTML = 'You Win! &#128513'
        } else {
        endMessage.innerHTML = 'You Lose &#128532'
        }
        document.getElementById('endGame-content').append(endMessage)
    }

}

var clearBoard = function (event) {
    var modalText = document.getElementById('endMessage'); // remove end game messages from modal

    modalText.parentNode.removeChild(modalText)
    document.getElementById('gameOver').style.display = 'none' // close modal
    var game = document.getElementById('gameBoard')
    while (game.hasChildNodes()) {
        game.removeChild(game.firstChild)
    }
    gameHasEnded = false;
    game.removeEventListener('mousedown', (event) => board.triggerCell(event))
    if (event.target.id === 'changeDifficulty') {
        document.getElementById('newGame').style.display = 'block'
        document.getElementById('gameRules').style.opacity = 0
    document.getElementById('gameStats').style.opacity = 0
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else if (event.target.id === 'playAgain') {
        let level;
        if (board.mines === 10) {level = 'Beginner'}
        else if (board.mines === 40) {level = 'Intermediate'}
        else {level = 'Expert'}
        createBoard(level)
    }
}


window.onload = () => {

    loadHighScores(); // populate high scores table when page loads

    const form = document.getElementById('newGame');
    form.addEventListener('submit', selectLevel)

    const highScores = document.getElementById('viewHighScores')
    highScores.addEventListener('click', () => document.getElementById('highScores').style.display = 'block')
    const closeHighScores = document.getElementById('closeHighScores');
    closeHighScores.addEventListener('click', () => document.getElementById('highScores').style.display = 'none')

    document.getElementById('changeDifficulty').addEventListener('click', (event) => clearBoard(event))
    document.getElementById('playAgain').addEventListener('click', (event) => clearBoard(event))
    document.addEventListener('gameOver', (event) => endGame(event.detail)) // for when game is over

}

