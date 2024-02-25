const D = require("./defaults");

class Lube { //overkill
    constructor(lube, pos) {
        this.amount = lube;
        this.pos = pos;
        this.id = D.generateID();
    }

    display() {
      return {pos: this.pos}; //to display over socket
    }
}

module.exports = Lube;
