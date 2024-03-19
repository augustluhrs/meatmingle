class Husk {
  constructor (husk) {
      this.pos = husk.pos;
      this.radius = husk.radius;
      this.dryTimer = husk.dryTimer || 1000;
  }

  doneDrying() {
      this.dryTimer -= 1;
      // if (this.dryTimer <= 0){
      //     return true; //fully dried
      // } else {
      //     return false;
      // }
      return (this.dryTimer <= 0);
  }

  display() {
      let fade = this.dryTimer / 1000; //normalized
      return {pos: {x: this.pos.x, y: this.pos.y}, radius: this.radius, fade: fade}; 
  }
}

module.exports = Husk; 
