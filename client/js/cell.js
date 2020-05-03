class Cell {

  constructor(hasMine, hasFlag, isTurnedOver) {
      this.hasMine = hasMine;
      this.hasFlag = hasFlag;
      this.isTurnedOver = isTurnedOver
  }

  plantFlag() {
      if (!this.hasFlag) { // plant a flag if there isn't already one there
          this.hasFlag = true;
      }
  }

  turnOver() {
      if (!this.hasFlag && !this.isTurnedOver) { // only turn square over if there isn't a flag and it hasn't already been turned over
          if (this.hasMine) {
              alert('mine!!!!!')
              // return 'mine' to board so it can turn square red/show mine, and end game
          } else {
            this.isTurnedOver = true;
            // communicate to board that there's no mine here: board must check other adjacent mines to get neighbors etc. 
          }
      }
  }


}