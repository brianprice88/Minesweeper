var board;
var gameHasEnded = false;
var startTime;
var timeInterval;
var level;
var clickListener = function (event) {
  board.triggerCell(event);
}; // event handler callback is added at beginning of game and removed at end, thus placed in global scope

// const URI = "https://minesweeper-brian-price.herokuapp.com/highScores";
const URI = "http://localhost:3000/highScores";

var loadHighScores = function () {
  var scores = [];
  fetch(URI, { method: "GET" })
    .then((data) => data.json())
    .then((res) => scores.push(res.highScores))
    // .then((res) => scores.push(res)) // use this for Mongo instead of the previous line
    .then((next) => appendScores(scores[0]))
    .catch((err) => console.error(err));
};

var appendScores = function (scores) {
  scores.sort((a, b) => a["time"] - b["time"]);
  for (var i = 0; i < scores.length; i++) {
    var scoreRow = document.createElement("tr");
    var scoreName = document.createElement("td");
    var scoreTime = document.createElement("td");
    scoreName.innerHTML = scores[i].name;
    const mins = Math.floor(scores[i].time / 60);
    let secs = scores[i].time - mins * 60;
    if (secs < 10) {
      secs = "0" + secs;
    }
    scoreTime.innerHTML = mins + ":" + secs;
    scoreRow.append(scoreName);
    scoreRow.append(scoreTime);
    if (scores[i].level === "Beginner") {
      document.getElementById("BeginnerScores").append(scoreRow);
    } else if (scores[i].level === "Intermediate") {
      document.getElementById("IntermediateScores").append(scoreRow);
    } else if (scores[i].level === "Expert") {
      document.getElementById("ExpertScores").append(scoreRow);
    }
  }
};

var selectLevel = function (event) {
  event.preventDefault();
  if (event.target[0].checked) {
    level = "Beginner";
  } else if (event.target[1].checked) {
    level = "Intermediate";
  } else if (event.target[2].checked) {
    level = "Expert";
  }
  document.getElementById("newGame").style.display = "none";
  document.getElementById("gameBoard").style.opacity = 1;
  document.getElementById("gameRules").style.opacity = 1;
  document.getElementById("gameStats").style.opacity = 1;
  createBoard(level);
};

var createBoard = function (level) {
  let rows;
  let columns;
  let mines;
  let flags;
  switch (level) {
    case "Beginner":
      rows = 9;
      columns = 9;
      mines = 10;
      flags = 10;
      break;
    case "Intermediate":
      rows = 16;
      columns = 16;
      mines = 40;
      flags = 40;
      break;
    case "Expert":
      rows = 16;
      columns = 30;
      mines = 99;
      flags = 99;
      break;
  }
  board = new Board(rows, columns, mines, flags);
  board.buildBoard();
  document
    .getElementById("gameBoard")
    .addEventListener("mousedown", clickListener);
  document.getElementById("minutesElapsed").innerHTML = "";
  document.getElementById("secondsElapsed").innerHTML = "";
  startTime = new Date();
  timeInterval = setInterval(runTimer, 1000);
};

var runTimer = function () {
  const timeElapsed = Math.floor((new Date() - startTime) / 1000);
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed - minutes * 60;
  document.getElementById("minutesElapsed").innerHTML = minutes;
  document.getElementById("secondsElapsed").innerHTML = seconds;
};

var endGame = function (result) {
  if (!gameHasEnded) {
    clearInterval(timeInterval);
    var endTime = Math.floor((new Date() - startTime) / 1000);
    gameHasEnded = true;
    for (var i = 0; i < board.cells.length; i++) {
      for (var j = 0; j < board.cells[i].length; j++) {
        if (!board.cells[i][j].isTurnedOver) {
          board.turnOverCell(board.cells[i][j]);
        }
      }
    }
    document.getElementById("gameOver").style.display = "block";
    var endMessage = document.createElement("h1");
    endMessage.setAttribute("id", "endMessage");
    if (result === "win") {
      endMessage.innerHTML = "You Win!";
      endMessage.setAttribute("class", "youWin");
      var tableRows = document.getElementById(`${level}Scores`).children.length;
      if (tableRows > 2) {
        var lowestScore = document.getElementById(`${level}Scores`).children[
          tableRows - 1
        ].children[1].innerHTML;
        var lowestScoreFormatted =
          parseInt(lowestScore.split(":")[0]) * 60 +
          parseInt(lowestScore.split(":")[1]);
      }
      if (tableRows < 12 || endTime < lowestScoreFormatted) {
        // tableRows < 12 means fewer than 10 high scores thus this is automatically a high score
        endMessage.innerHTML += "<br> And you got a high score!<br>";
        var addHighScore = document.createElement("input");
        addHighScore.setAttribute("type", "text");
        addHighScore.setAttribute("placeholder", "Enter your name");
        addHighScore.setAttribute("id", "addHighScore");
        endMessage.append(addHighScore);
        var addScoreButton = document.createElement("button");
        addScoreButton.setAttribute("id", "addScoreButton");
        addScoreButton.innerHTML = "Add to high scores";
        endMessage.append(addScoreButton);
        var deletePrevHighScore = tableRows < 12 ? false : true;
        addScoreButton.addEventListener("click", () =>
          addScore(endTime, deletePrevHighScore)
        );
      }
    } else if (result === "lose") {
      endMessage.innerHTML = "You Lose";
      endMessage.setAttribute("class", "youLose");
    }
    document.getElementById("endGame-content").append(endMessage);
  }
};

var addScore = function (time, needToUpdate) {
  let name = document.getElementById("addHighScore").value;
  if (!name.match(/^[a-zA-Z]+$/)) {
    return;
  }
  if (name.length > 12) {
    name = name.slice(0, 12);
  }
  const highScore = document.getElementById("addHighScore");
  const highScoreSubmit = document.getElementById("addScoreButton");
  highScore.parentNode.removeChild(highScore);
  highScoreSubmit.parentNode.removeChild(highScoreSubmit);
  endMessage.innerHTML = "Score submitted";
  const options = { name, time, level };
  if (needToUpdate) {
    const elementToRemove = document.getElementById(`${level}Scores`).lastChild;
    const nameToRemove = elementToRemove.children[0].innerHTML;
    const timeToRemove = elementToRemove.children[1].innerHTML;
    options.nameToRemove = nameToRemove;
    options.timeToRemove = timeToRemove;
    fetch(URI, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    })
      .then((res) => loadHighScores())
      .catch((err) => console.error(err));
  } else {
    fetch(URI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    })
      .then((res) => loadHighScores())
      .catch((err) => console.error(err));
  }
  const levels = ["Beginner", "Intermediate", "Expert"];
  for (var x = 0; x <= 2; x++) {
    const scoreRows = Array.from(
      document.getElementById(`${levels[x]}Scores`).children
    ).slice(2); // ignore caption/tbody but remove score rows from the tables
    for (var i = 0; i < scoreRows.length; i++) {
      scoreRows[i].parentNode.removeChild(scoreRows[i]);
    }
  }
};

var clearBoard = function (event) {
  var modalText = document.getElementById("endMessage");
  modalText.parentNode.removeChild(modalText);
  document.getElementById("gameOver").style.display = "none";
  var game = document.getElementById("gameBoard");
  while (game.hasChildNodes()) {
    game.removeChild(game.firstChild);
  }
  gameHasEnded = false;
  game.removeEventListener("mousedown", clickListener);
  if (event.target.id === "changeDifficulty") {
    document.getElementById("newGame").style.display = "block";
    document.getElementById("gameRules").style.opacity = 0;
    document.getElementById("gameStats").style.opacity = 0;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  } else if (event.target.id === "playAgain") {
    createBoard(level);
  }
};

window.onload = () => {
  document.getElementById("loading").style.display = "none";
  document.getElementById("game").style.display = "block";
  window.addEventListener("contextmenu", (e) => e.preventDefault());
  loadHighScores();
  const form = document.getElementById("newGame");
  form.addEventListener("submit", selectLevel);
  const highScores = document.getElementById("viewHighScores");
  highScores.addEventListener(
    "click",
    () => (document.getElementById("highScores").style.display = "block")
  );
  const closeHighScores = document.getElementById("closeHighScores");
  closeHighScores.addEventListener(
    "click",
    () => (document.getElementById("highScores").style.display = "none")
  );
  document
    .getElementById("changeDifficulty")
    .addEventListener("click", (event) => clearBoard(event));
  document
    .getElementById("playAgain")
    .addEventListener("click", (event) => clearBoard(event));
  document.addEventListener("gameOver", (event) => endGame(event.detail)); // for when game is over
};
