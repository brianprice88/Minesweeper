const Game = require ('../client/js/game');
const Board = require('../client/js/board');
const Cell = require('../client/js/cell')
const fs = require('fs');
const html = fs.readFileSync('./client/index.html', 'utf8');

jest
    .dontMock('fs');

const expect = require('chai').expect;

describe('Game', () => {
    
    beforeEach(() => {
        document.documentElement.innerHTML = html.toString();
    })

    afterEach(() => {
        jest.resetModules();
    })

    it('should create a new game when user selects what level to play', () => {
    var form = document.getElementById('newGame')
    form.addEventListener('submit', Game.selectLevel)
    
    
    
    })
})