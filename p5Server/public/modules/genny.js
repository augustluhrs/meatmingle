const DNA = require("./DNA");
const Victor = require("victor");
const lerp = require("lerp");
const D = require("./defaults");

class Genny {
  constructor(source, data){
    //new Genny from client or from mating?
    if (source == "client") {
      this.poem = data.poem;
      // this.colors = data.colors;
      //need to convert hex to HSL for lerp later
      this.colors = [
        D.hexToHSL(data.colors[0]),
        D.hexToHSL(data.colors[1]),
        D.hexToHSL(data.colors[2])
      ]
      //we get normalized values from creator, need to map to Defaults
      this.radius = data.radius; 
      this.maxSpeed = data.maxSpeed;
      this.refractoryPeriod = data.refractoryPeriod;
      this.childInheritance = data.childInheritance;
      this.minLubeToMate = data.minLubeToMate;
      this.pos = new Victor(Math.random() * D.ecoWidth, Math.random() * D.ecoHeight);
      this.wetness = D.options.maxWetness;
      this.DNA = new DNA(this);
    } else {
      let parentA = data.parentA;
      let parentB = data.parentB;
      this.pos = new Victor(parentA.pos.x, parentB.pos.y);
      this.wetness = data.inheritance;
      this.DNA = new DNA()

      //crossover
      //randomly split poems in two sections and smash together
      let poemA = parentA.split(" ");
      let poemB = parentB.split(" ");

      let splitA = Math.floor(Math.random() * poemA.length);
      let splitB = Math.floor(Math.random() * poemB.length);

      let firstHalf = poemA.slice(0, splitA);
      let secondHalf = poemB.slice(splitB);
      this.poem = [firstHalf, secondHalf].join(" ");
      this.DNA.genes[0] = this.poem;
      console.log(this.poem);

      //lerp between parent colors to get child colors
      let hueLerp;
      let colorsA = parentA.DNA.genes[1];
      let colorsB = parentB.DNA.genes[1];

      for (let i = 0; i < 3; i++) {
        //fixing issue where lerping between black/white (low sat) has weird hue
        if(colorsA[i][1] < .1 && colorsB[i][1] > .1) {
          colorsA[i][0] = colorsB[i][0];
        } else if (colorsB[i][1] < .1 && colorsA[i][1] > .1) {
            colorsB[i][0] = colorsA[i][0];
        }
        //now lerp hue across smallest path around ring
        if(Math.abs(colorsA[i][0] - colorsB[i][0]) >= .5){ //makes sure always takes the shortest path around the hue ring
            let smallerVal;
            if(colorsA[i][0] > colorsB[i][0]){
                smallerVal = colorsB[i][0] + 1; //since normalized, this is like adding 360
                hueLerp = lerp(colorsA[i][0], smallerVal, D.rand_bm(0, 1));
                hueLerp -= 1;
            } else {
                smallerVal = colorsA[i][0] + 1;
                hueLerp = lerp(colorsB[i][0], smallerVal, D.rand_bm(0, 1));
                hueLerp -= 1;
            }
        } else {
            hueLerp = lerp(colorsA[i][0], colorsB[i][0], D.rand_bm(0, 1))
        }

        this.DNA.genes[1][i] = [ //lerping hue normally unless would need to cross over 0, sat and light lerping normally
            hueLerp,
            lerp(colorsA[i][1], colorsB[i][1], D.rand_bm(0, 1)),
            lerp(colorsA[i][2], colorsB[i][2], D.rand_bm(0, 1))
        ];
      }

      //for all genes but color, normal lerp, with box-mueller random function
      for (let i = 2; i < this.DNA.genes.length; i++) { 
          this.DNA.genes[i] = lerp(parentA.DNA.genes[i], parentB.DNA.genes[i], D.rand_bm(0, 1));
      }

      //mutation
      for (let i = 0; i < 8; i++) {
        if (Math.random() < D.options.mutationRate) {
          // console.log(`MUTATION: ${i}`);
          //poem mutation TODO
          if (i == 0) {
            //randomly change characters? or replace words with sex words?    
          }
          //color mutation
          else if (i == 1) {
            for (let i = 0; i < 3; i++){
              let randColor = [Math.random(), Math.random(), Math.random()];
              this.DNA.genes[1][i] = [ //having to lerp each color individually -- reduced mutation max to 1/4 in any color direction so not too crazy
                  lerp(this.DNA.genes[1][i][0], randColor[0], Math.random() * 0.25),
                  lerp(this.DNA.genes[1][i][1], randColor[1], Math.random() * 0.25),
                  lerp(this.DNA.genes[1][i][2], randColor[2], Math.random() * 0.25)
              ];
            }
          } else {
              this.DNA.genes[i] += D.rand_bm(-1,1);; 
              this.DNA.genes[i] = Math.min(Math.max(this.DNA.genes[i], 0), 1); //DIY constrain
          }
        }
      }
      
    }
    
    //take DNA and map from normalized to min max range
    //this is messy, TODO
    this.colors = this.DNA.genes[1];
    this.radius = D.map(this.DNA.genes[2], 0, 1, D.options.minRadius, D.options.maxRadius);
    this.maxSpeed = D.map(this.DNA.genes[3], 0, 1, D.options.minSpeed, D.options.maxSpeed);
    this.refractoryPeriod = D.map(this.DNA.genes[4], 0, 1, D.options.minRefractory, D.options.maxRefminRefractory);
    this.childInheritance = D.map(this.DNA.genes[5], 0, 1, D.options.minInheritance, D.options.maxInheritance);
    this.minLubeToMate = D.map(this.DNA.genes[6], 0, 1, D.options.minLubeToMate, D.options.maxLubeToMate);

    //timers
    this.mateTimer = 0;
    this.lubeTimer = 0; //ticks down and subtracts wetness before resetting

    //states
    this.isReadyToMate = false;
    this.isMating = false;
  }


  frolic(gennies, lubeLocations){ //check for lube or mate, move

    //tick down the lube timer and subtract if needed
    this.lubeTimer ++; //need deltaTime?
    if (this.lubeTimer >= D.dryRate) {
      this.lubeTimer = 0;
      this.wetness --;
    }

  }

  display(){
    if (this.mateTimer >= this.refractoryPeriod && this.wetness >= this.minLubeToMate) {
      this.isReadyToMate = true;
    } else {
      // this.isReadyToMate = false; //no, should switch off in mate function
    }

    let pos = {x: this.pos.x, y: this.pos.y};
    return {pos: pos, genny: this}; //hmm....
  }
}

module.exports = Genny;
