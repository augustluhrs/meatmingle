// const DNA = require("./DNA");
const Victor = require("victor");
const lerp = require("lerp");
const D = require("./defaults");
const Boid = require("./flocking");
// const Pron = require('pronouncing'); //lol
const Pron = require('../libraries/pronouncing');
const Beats = require("./beats");


//poem moderation library
const {
	RegExpMatcher,
	TextCensor,
	englishDataset,
	englishRecommendedTransformers,
} = require('obscenity');

const matcher = new RegExpMatcher({
	...englishDataset.build(),
	...englishRecommendedTransformers,
});
const censor = new TextCensor();
const newStrat = () => "meat"; //noody
censor.setStrategy(newStrat);// not using grawlix because now using regex to elim all punctuation

//thanks chatgpt for teaching me regex finally
const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

class Genny {
  constructor(source, data){
    //new Genny from client or from mating?
    // console.log(source);
    if (source == "client") {
      this.id = data.id;
      this.poem = data.poem;
      this.generations = [0, 0];

      //obscenity censor
      // console.log(this.poem);
      let matches = matcher.getAllMatches(this.poem);
      // console.log("profanity matches: \n", matches);
      this.poem = censor.applyTo(this.poem, matches);
      // console.log(this.poem);
      this.poem = this.poem.replace(punctuationRegex, "");

      // this.colors = data.colors;
      //need to convert hex to HSL for lerp later
      this.colors = [
        D.hexToHSL(data.colors[0]),
        D.hexToHSL(data.colors[1]),
        D.hexToHSL(data.colors[2])
      ]
      this.looks = [ data.body, data.zones, data.hair ];

      //we don't get normalized values from creator, need to map to Defaults
      this.maxSpeed = D.map(data.thirsty, 0, 16, 0, 1); 
      this.refractoryPeriod = D.map(data.prolific, 0, 16, 0, 1); 
      this.childInheritance = D.map(data.generous, 0, 16, 0, 1); 
      this.lubeEfficiency = D.map(data.prepared, 0, 16, 0, 1);
      // this.minLubeToMate = D.options.minLubeToMate;

      // this.radius = D.map(data.generous, 0, 16, D.options.minRadius, D.options.maxRadius);
      this.radius = D.map(data.generous, 0, 16, 0, 1);
      this.pos = new Victor(Math.random() * D.ecoWidth, Math.random() * D.ecoHeight);
      this.wetness = D.options.maxWetness;
      // this.DNA = new DNA(this);
      this.genes = [
        this.poem,
        this.colors,
        this.radius,
        this.maxSpeed,
        this.refractoryPeriod,
        this.childInheritance,
        this.lubeEfficiency
      ];
    } else {  //new baby
      this.id = D.generateID();

      let parentA = data.parentA;
      let parentB = data.parentB;
      this.pos = new Victor(parentA.pos.x, parentB.pos.y);
      this.wetness = data.inheritance;
      // this.DNA = new DNA()
      this.genes = []; //don't need to fill with dummy data?
      this.generations = [Math.max(parentA.generations[0], parentA.generations[1]) + 1, Math.max(parentB.generations[0], parentB.generations[1]) + 1]

      // console.log("\nnew baby from :")
      // console.log(parentA.id);
      // console.log(parentB.id);

      //crossover
      //randomly split poems in two sections and smash together
      // console.log(parentA.poem);
      // console.log(parentB.poem);

      let poemA = parentA.poem.split(" ");
      let poemB = parentB.poem.split(" ");

      // this.poem = "this line of poetry is far far far far far too long"
      // while (this.poem.split(" ").length >= 12) { //dumb, i know. TODO replace with syllable count
      let iDontKnowHowToCode = true;
      // let crossoverSyllables = 1;
      let wordCount = 14; //changing to this 
      // while(iDontKnowHowToCode || !(crossoverSyllables % 2 == 0 || (crossoverSyllables >= 7 || crossoverSyllables <= 9))) { //don't judge me  
      while(wordCount > 12 || wordCount < 3) {
        // iDontKnowHowToCode = false;
        let splitA = Math.min(Math.max(1, Math.floor(Math.random() * poemA.length)), poemA.length);
        let splitB = Math.min(Math.max(1, Math.floor(Math.random() * poemB.length)), poemB.length);
        // console.log(splitA);
        // console.log(splitB);
        let firstHalf = poemA.slice(0, splitA);
        let secondHalf = poemB.slice(splitB);
        // console.log(firstHalf);
        // console.log(secondHalf);
        this.poem = [firstHalf, secondHalf].join(" ");
        this.poem = this.poem.replace(punctuationRegex, " ");

        wordCount = this.poem.split(" ").length;
        // crossoverSyllables = 0;
        // for (let word of this.poem) {
        //   crossoverSyllables += Beats.countSyllablesInWord(word);
        // }
      }
      
   

      //obscenity censor
      let matches = matcher.getAllMatches(this.poem);
      this.poem = censor.applyTo(this.poem, matches);
      // console.log(this.poem);

      this.genes[0] = this.poem;

      //TODO length max

      //looks don't lerp, they just pick from each parent randomly
      //awww... he has your penises!
      let looksA = parentA.looks;
      let looksB = parentB.looks;
      this.looks = [];
      for (let i = 0; i < 3; i++){
        if (Math.random() > .5) {
          this.looks.push(looksA[i]);
        } else {
          this.looks.push(looksB[i]);
        }
      }

      //lerp between parent colors to get child colors
      let hueLerp;
      let colorsA = parentA.genes[1];
      let colorsB = parentB.genes[1];
      this.genes[1] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; //dummy colors

      for (let i = 0; i < 3; i++) {
        //fixing issue where lerping between black/white (low sat) has weird hue
        if(colorsA[i][1] < .1 && colorsB[i][1] > .1) {
          colorsA[i][1] = colorsB[i][1];
        } else if (colorsB[i][1] < .1 && colorsA[i][1] > .1) {
            colorsB[i][1] = colorsA[i][1];
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

        this.genes[1][i] = [ //lerping hue normally unless would need to cross over 0, sat and light lerping normally
            hueLerp,
            lerp(colorsA[i][1], colorsB[i][1], D.rand_bm(0, 1)),
            lerp(colorsA[i][2], colorsB[i][2], D.rand_bm(0, 1))
        ];
      }
      // console.log("child colors");
      // console.log(this.genes[1]);

      //for all genes but color, normal lerp, with box-mueller random function
      // for (let i = 2; i < this.genes.length; i++) { 
      for (let i = 2; i < 7; i++) { //now hardcoding because not starting with dummy genes array
          this.genes[i] = lerp(parentA.genes[i], parentB.genes[i], D.rand_bm(0, 1));
      }

      //mutation
      for (let i = 0; i < 7; i++) {
        if (Math.random() < D.options.mutationRate) {
          console.log(`MUTATION: ${i}`);
          //poem mutation
          if (i == 0) {
            // console.log("poem mutation!")
            // console.log(this.poem);

            //replace a random word in poem with sex word from mutation pool
            //now adding chance to add random word
            let poemArr = this.poem.split(" ");
            let mutationWord = mutationWords[Math.floor(Math.random() * mutationWords.length)]
            if (Math.random() > 0.5) {
              //add word
              let wordIndex = Math.floor(Math.random() * poemArr.length + 1);
              if (wordIndex == poemArr.length) {
                poemArr.push(mutationWord);
              } else {
                poemArr.splice(wordIndex, 0, mutationWord);
              }
            } else {
              //replace word
              let wordIndex = Math.floor(Math.random() * poemArr.length);
              poemArr.splice(wordIndex, 1, mutationWord);
            }
           
            this.poem = poemArr.join(" ");
            this.poem = this.poem.replace(punctuationRegex, " ");
            console.log(this.poem);
          }
          //color mutation
          else if (i == 1) {
            for (let i = 0; i < 3; i++){
              let randColor = [Math.random(), Math.random(), Math.random()];
              this.genes[1][i] = [ //having to lerp each color individually -- reduced mutation max to 1/4 in any color direction so not too crazy
                  lerp(this.genes[1][i][0], randColor[0], Math.random() * 0.25),
                  lerp(this.genes[1][i][1], randColor[1], Math.random() * 0.25),
                  lerp(this.genes[1][i][2], randColor[2], Math.random() * 0.25)
              ];
            }
          } else {
              this.genes[i] += D.rand_bm(-1,1);; 
              this.genes[i] = Math.min(Math.max(this.genes[i], 0), 1); //DIY constrain
          }
        }
      }
      
    }
    
    //take DNA and map from normalized to min max range
    //this is messy, TODO
    this.colors = this.genes[1];
    this.radius = D.map(this.genes[2], 0, 1, D.options.minRadius, D.options.maxRadius);
    this.maxSpeed = D.map(this.genes[3], 0, 1, D.options.minSpeed, D.options.maxSpeed);
    this.refractoryPeriod = D.map(this.genes[4], 0, 1, D.options.minRefractory, D.options.maxRefractory);
    this.childInheritance = D.map(this.genes[5], 0, 1, D.options.minInheritance, D.options.maxInheritance);
    this.lubeEfficiency = D.map(this.genes[6], 0, 1, D.options.minLubeEfficiency, D.options.maxLubeEfficiency)
    // this.minLubeToMate = D.map(this.genes[6], 0, 1, D.options.minLubeToMate, D.options.maxLubeToMate);
    this.minLubeToMate = D.options.minLubeToMate;

    this.direction = 0;
    //timers
    this.mateTimer = 0;
    this.lubeTimer = 0; //ticks down and subtracts wetness before resetting

    //states
    this.isHorny = false;
    this.isTooDry = false;
    this.isReadyToMate = false;
    this.isMating = false;
    this.isHusk = false; //death by dryness

    //at end so flocking has all info
    this.boid = new Boid(this);

    // console.log("server genny:");
    // console.log(this);

    //testing syllable count
    // console.log("\n\nsyllable count for: " + this.poem + "\n");
    let syllables = 0;
    for (let word of this.poem.split(" ")) {
      // console.log("num phones per word: " + Pron.phonesForWord(word).length);
      // console.log("syllables in " + word + ":");
      // console.log(Pron.syllableCount(Pron.phonesForWord(word)[0]));
      let phones = Pron.phonesForWord(word);
      if (phones.length > 0) {
        syllables += Pron.syllableCount(phones[0]);
      } else {
        syllables++; //hmm
      }
    }
    // console.log(syllables + "\n");

    // split poem into four beats per bar
    this.beats = Beats.splitPoemForBar(this.poem);
  }


  frolic(gennies, lubeLocations){ //check for lube or mate, move

    //tick down the lube timer and subtract if needed
    this.lubeTimer ++; //need deltaTime?
    if (this.lubeTimer >= D.options.dryRate) {
      this.lubeTimer = 0;
      this.wetness --;
    }

    //check for mating conditions
    this.isTooDry = (this.wetness <= this.minLubeToMate);
    this.isHorny = (this.mateTimer >= this.refractoryPeriod);
    this.isReadyToMate = (this.isHorny && !this.isTooDry);

    // let [velocity, lube, mate] = this.boid.run(this, gennies, lubeLocations);
    let [lube, mate] = this.boid.run(this, gennies, lubeLocations);

    return [lube, mate];
  }

  // dryOut(){
    //triggered death on mating when left with negative wetness, turns into husk
  // }

  display() {
    let pos = {x: this.pos.x, y: this.pos.y};
    return {pos: pos, genny: this}; //hmm....
  }
}

//mutation word pool
let mutationWords = [
  "meat",
  "mingle",
  "noody",
  "word",
  "hack",
  "wordhack",
  "wonderville",
  "brooklyn",
  "todd",
  "art",
  "poem",
  "theythem",
  "moist",
  "bounce",
  "poem",
  "hard",
  "wet",
  "slut",
  "daddy",
  "mommy",
  "hole",
  "top",
  "bottom",
  // "vers",
  "switch",
  "naked",
  "thirsty",
  "lube",
  "condom",
  "fuck",
  "hard",
  "ass",
  "bussy",
  "thussy",
  "throat",
  // "pussy",
  // "tits",
  // "whore",
  "horse",
  "gristle",
  "bits",
  "balls",
  "pulse",
  "throb",
  // "member",
  // "flower",
  "horseboy",
  "clit",
  "flaps",
  "silicone",
  "beef",
  "sausage",
  "cream",
  // "bible",
  "zaddy",
  // "holy",
  "naughty",
  "slick",
  // "kneel",
  "down",

]

module.exports = Genny;
