
var board; // board is initially undefined
var gameHasEnded = false; // will be used to run game end function just once
var startTime;
var timeInterval;
var level;

var loadHighScores = function () { // TO DO
    var scores = [];
    fetch('http://localhost:3000/highScores')
        .then(data => data.json())
        .then(res => scores.push(res))
        .catch(err => console.error(err))
    scores.sort((a, b) => (a['score'] - b['score'])) // sort by scores

    for (var i = 0; i < scores.length; i++) {
        var scoreRow = document.createElement('tr')
        var scoreName = document.createElement('td')
        var scoreTime = document.createElement('td')
        scoreName.innerHTML = scores[i].name
        var mins = Math.floor(scores[i].time / 60)
        var secs = scores[i].time - (mins * 60)
        scoreTime.innerHTML = mins + ':' + secs
        scoreRow.append(scoreName)
        scoreRow.append(scoreTime)
        if (scores[i].level = 'Beginner') {
            document.getElementById('BeginnerScores').append(scoreRow)
        } else if (scores[i].level === 'Intermediate') {
            document.getElementById('IntermediateScores').append(scoreRow)

        } else {
            document.getElementById('ExpertScores').append(scoreRow)

        }
    }
}

var selectLevel = function (event) { // user selects level to play
    event.preventDefault();
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

    document.getElementById('minutesElapsed').innerHTML = ''
    document.getElementById('secondsElapsed').innerHTML = ''
    startTime = new Date();
    timeInterval = setInterval(runTimer, 1000)

}

var runTimer = function () {
    var timeElapsed = Math.floor((new Date() - startTime) / 1000);
    var minutes = Math.floor(timeElapsed / 60)
    var seconds = timeElapsed - (minutes * 60)
    document.getElementById('minutesElapsed').innerHTML = minutes;
    document.getElementById('secondsElapsed').innerHTML = seconds
}


var endGame = function (result) {
    if (!gameHasEnded) {
        clearInterval(timeInterval)
        var endTime = Math.floor((new Date() - startTime) / 1000);

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

        console.log(document.getElementById(`${level}Scores`).children.length)


        if (result === 'win') {
            endMessage.innerHTML = 'You Win! &#128513'
            var tableRows = document.getElementById(`${level}Scores`).children[1].children.length
            if (tableRows < 11) { // if tbody has fewer than 11 children it means fewer than 10 high scores in this table
                //high score by default
                alert('high score!')
            } else if (tableRows >= 11) { // 11 or more children means check if this beat the high score
                var lowestScore = parseInt(document.getElementById(`${level}Scores`).children[1].children[tableRows - 1].children[1].innerHTML)
                if (endTime < lowestScore) {
                    // new high score
                }
            }
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

