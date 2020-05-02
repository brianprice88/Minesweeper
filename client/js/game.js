
var board; // board is initially undefined

var selectLevel = function (event) { // user selects level to play
    event.preventDefault();
    let level;
    if (event.target[0].checked) { level = 'Beginner' }
    else if (event.target[1].checked) { level = 'Intermediate' }
    else if (event.target[2].checked) { level = 'Expert' }
    document.getElementById('newGame').style.display = 'none' // hide the signup form
    document.getElementById('gameBoard').style.opacity = 1 // reveal the game board

    createBoard(level)

}

var createBoard = function (level) {
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
    console.log(board)
}





window.onload = () => {

    const form = document.getElementById('newGame');
    form.addEventListener('submit', selectLevel)

}



// function click(event) { // 1 = left click, 3 = right click --> add event listener on each square for 'mousedown'
//     console.log(event.which)
// }

if (typeof exports !== 'undefined') {
    module.exports = {
        selectLevel,
        createBoard
    }
}