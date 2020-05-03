class Cell {

    constructor(hasBomb, hasFlag, isTurnedOver) {
        this.hasBomb = hasBomb;
        this.hasFlag = hasFlag;
        this.isTurnedOver = isTurnedOver
    }

}


if (typeof exports !== 'undefined') {
    module.exports = {
        Cell
    }
}