const D = require("./defaults");

class Lube { //overkill
    constructor(lube, pos) {
        this.amount = lube;
        this.pos = pos;
        this.emoji = D.options.lubeEmojis[Math.floor(Math.random() * D.options.lubeEmojis.length)]
        this.id = D.generateID();
    }

    display() {
      return {pos: this.pos, emoji: this.emoji}; //to display over socket
    }
}

module.exports = Lube;
