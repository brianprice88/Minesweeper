
var board; // board is initially undefined
var gameHasEnded = false; // will be used to run game end function just once
var startTime;
var timeInterval;
var level;

var loadHighScores = function () {
    var scores = []
    fetch('http://localhost:3000/highScores', {method: 'GET'})
        .then(data => data.json())
        .then(res => scores.push(res))
        .then(next => appendScores(scores))
        .catch(err => console.error(err))
}

var appendScores = function(scores) {
    scores = scores[0] // because the response array was pushed into the scores array
    scores.sort((a, b) => (a['time'] - b['time'])) // sort by scores
    for (var i = 0; i < scores.length; i++) {
        var scoreRow = document.createElement('tr')
        var scoreName = document.createElement('td')
        var scoreTime = document.createElement('td')
        scoreName.innerHTML = scores[i].name
        var mins = Math.floor(scores[i].time / 60)
        var secs = scores[i].time - (mins * 60)
        if (secs < 10) {secs = '0' + secs}
        scoreTime.innerHTML = mins + ':' + secs
        scoreRow.append(scoreName)
        scoreRow.append(scoreTime)
        if (scores[i].level = 'Beginner') {
            document.getElementById('BeginnerScores').append(scoreRow)
        } else if (scores[i].level = 'Intermediate') {
            document.getElementById('IntermediateScores').append(scoreRow)

        } else if (scores[i].level = 'Expert') {
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


        if (result === 'lose') {
            endMessage.innerHTML = 'You Win! &#128513'
            var tableRows = document.getElementById(`${level}Scores`).children.length
            var lowestScore = document.getElementById(`${level}Scores`).children[tableRows - 1].children[1].innerHTML
            var lowestScoreFormatted = (parseInt(lowestScore.split(':')[0])) * 60 + (parseInt(lowestScore.split(':')[1]))
            console.log(lowestScoreFormatted, endTime)
            if (tableRows < 11 || (endTime < lowestScoreFormatted)) { // if tbody has fewer than 11 children it means fewer than 10 high scores in this table, while 11 or more children means check if this beat the high score
            endMessage.innerHTML += 'And you got a high score!'
              var addHighScore = document.createElement('input')
              addHighScore.setAttribute('type', 'text')
              addHighScore.setAttribute('placeholder', 'Enter your name to add your score')
              addHighScore.setAttribute('id', 'addHighScore')
              endMessage.append(addHighScore)
              var addScoreButton = document.createElement('button')
              addScoreButton.setAttribute('id', 'addScoreButton')
              addScoreButton.innerHTML = 'Add your score'
              endMessage.append(addScoreButton)
              var deletePrevHighScore = tableRows < 11 ? false : true
              addScoreButton.addEventListener('click', () => addScore(endTime, deletePrevHighScore))
            } 

        } else {
            endMessage.innerHTML = 'You Lose &#128532'
        }
        document.getElementById('endGame-content').append(endMessage)
    }

}

var addScore = function(time, needToUpdate) {
  var name = document.getElementById('addHighScore').value;
  if (!name.match(/^[a-zA-Z]+$/)) {return} // make sure name is valid
  
  const highScore = document.getElementById('addHighScore')
  const highScoreSubmit = document.getElementById('addScoreButton')
  highScore.parentNode.removeChild(highScore)
  highScoreSubmit.parentNode.removeChild(highScoreSubmit)


  const options = {name, time, level};
  const elementToRemove = document.getElementById(`${level}Scores`).lastChild
  const nameToRemove = elementToRemove.children[0].innerHTML;
  const timeToRemove = elementToRemove.children[1].innerHTML;

  const scoreRows = Array.from(document.getElementById(`${level}Scores`).children).slice(2) // ignore caption/tbody but remove score rows
    for (var i = 0; i < scoreRows.length; i++) {
        scoreRows[i].parentNode.removeChild(scoreRows[i])
    }

  if (needToUpdate) { // put request to remove lowest score and replace with this one
    options.nameToRemove = nameToRemove;
    options.timeToRemove = timeToRemove;
    fetch('http://localhost:3000/highScores', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(options)})
    .then(res => loadHighScores())
    .catch(err => console.error(err))
  } else { // post request to add new score if there aren't 10 high scores for this level
    fetch('http://localhost:3000/highScores', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(options)})
    .then(res => loadHighScores())
    .catch(err => console.error(err))
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
    // game = undefined; // is this line needed either?
    // game.removeEventListener('mousedown', (event) => board.triggerCell(event)) // is this line needed?
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

