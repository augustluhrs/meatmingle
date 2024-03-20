/*
    ~ * ~ * ~ * SERVER
    ~ * ~ * ~ * 
    ~ * ~ * ~ * I regret, but I do not repent.
    ~ * ~ * ~ * 
*/

//create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function(){
  console.log('Server is listening at port: ', port);
});

//where we look for files
app.use(express.static('public'));

//nedb database stuff
// const Datastore = require('nedb');
// let backupDB = new Datastore({filename: "databases/backup.db", autoload: true});
// let ecosystemDB = new Datastore({filename: "databases/ecosystem.db", autoload: true});

//ecosystem variables
const D = require("./public/modules/defaults");
const Genny = require("./public/modules/genny");
const Lube = require("./public/modules/lube");
const Husk = require("./public/modules/husk");

let gennies = [];
let lubeLocations = [];
let husks = [];
let updates = {
  gennies: [],
  lubeLocations: [],
  husks: [],
  newHusks: []
};
let screenIsPaused = false;

//beats/speech
const Beats = require("./public/modules/beats");

// structured clone for node 16
const structuredClone = require('realistic-structured-clone');

//socket variables
var socket = require('socket.io');
var io = socket(server, {
  cors: {
    origin: true
  },
});

//
//  creation client (mobile)
//

var inputs = io.of('/')
//listen for anyone connecting to default namespace
inputs.on('connection', (socket) => {
  // console.log('new input client!: ' + socket.id);s

  socket.on("makeGenny", (data) => {
    data.id = D.generateID();
    // console.log("new genny from " + socket.id);
    // console.log(data);
    let newGenny = new Genny("client", data);
    gennies.push(newGenny);
    
    screen.emit("newGenny", newGenny);
  });

  //listen for this client to disconnect
  socket.on('disconnect', () => {
    // console.log('input client disconnected: ' + socket.id);
  });

});

//
// ecosystem screen
//

let screen = io.of('/screen');
screen.on('connection', (socket) => {
  // console.log('new screen client!: ' + socket.id);

  socket.on("getEcosystem", (socket) => { //when screen resets
    // console.log('sending screen the current gennies');
    for (let genny of gennies) {
      screen.emit("newGenny", genny); //hmm forgot emit rules TODO
    }

    screen.emit("changeSettings", {beatInterval: Beats.beatInterval});
  });

  socket.on("makeRandomGenny", () => {
    addRandomGenny();
  });

  socket.on("newLube", (data) => {
    lubeLocations.push(new Lube(D.options.lubeSize, data));
  });

  socket.on("clearLube", ()=>{
    //screen button that clears all lube
    lubeLocations = [];
  });

  socket.on("pause", ()=>{
    //screen button that pauses all updates (but new gennies will still get added)
    screenIsPaused = true;
  });

  socket.on("resume", ()=>{
    //screen button that clears all lube
    screenIsPaused = false;
  });



  //listen for this client to disconnect
  socket.on('disconnect', () => {
    // console.log('screen client disconnected: ' + socket.id);
  });
});

//
// SERVER LOOP
//

setInterval( () => {
  //check for pause from screen
  if (screenIsPaused) {
    return;
  }
  // let updates = { //this seems like a bad thing to do
  updates = {
    gennies: [],
    lubeLocations: [],
    husks: [],
    newHusks: [], //just so screen can pop from queue on first sign of death
  };

  //show all the lube
  lubeLocations.forEach( (lube) => {
    updates.lubeLocations.push(lube.display());
  });

  //feed and fuck
  let mates = [];
  // if(this.critterCount <= 500) { // arbitrary pop threshold for now
  //     this.checkForMates(mates);
  // }
  let oldGennies = structuredClone(gennies);
  for (let genny of gennies) {
    let [lube, mate] = genny.frolic(oldGennies, lubeLocations);

    if (lube != undefined) {
      let lubeIndex = lubeLocations.findIndex( (element) => {
          return element.id == lube.id
      });

      lubeLocations.splice(lubeIndex, 1);
      genny.wetness += D.options.lubeSize + genny.lubeEfficiency; //prepared gennies make more use of the lube they find...
    }

    //genny mates -- to be resolved in checkForMates() below
    if (mate != undefined) {
        mates.push({self: genny, mate: mate});
        // console.log('ilikeu');
    } else {
        genny.mateTimer++;
    }
  }

  checkForMates(mates);

  for (let i = gennies.length - 1; i >= 0; i--){
    let g = gennies[i];
    //check for gennies that have dried out
    if (g.isHusk) {
      //remove from gennies array and add to husks
      updates.newHusks.push(g.id); //going to run into issues with reference?
      husks.push(new Husk(g));
      // updates.husks
      gennies.splice(i, 1);
    } else {
      //otherwise, add to updates
      updates.gennies.push(g.display());
    }
  }

  //check for husks done drying out
  for (let i = husks.length - 1; i >= 0; i--) {
    let h = husks[i];
    if (h.doneDrying()) {
      husks.splice(i, 1);
    } else {
      updates.husks.push(h.display());
    }
  }
  

  screen.emit("update", updates);
}, 10);

let numGennies, lubeFactor; //trying to reuse more variables to avoid performance hits
function checkForMates(mates) {
    //just check for pair matches first
    let pairs = [];
    for (let i = mates.length - 1; i >= 0; i--) {
        for (let j = 0; j < i; j++) { //so won't overlap with same pair again
            // console.log(JSON.stringify(mates));
            if (mates[i].self.id == mates[j].mate.id && mates[i].mate.id == mates[j].self.id){ //adding the double check in case throuple...
                pairs.push({A: mates[i].self, B: mates[j].self});
            }
        }
    }
    //then make babies from the matched pairs
    pairs.forEach( (parents) => {
        //reset mateTimers
        parents.A.mateTimer = 0;
        parents.B.mateTimer = 0;

        //check for lube factor --> population control scaling (normal amount at 8 gennies)
        lubeFactor = 1; 
        numGennies = gennies.length;
        if (numGennies < 8) {
          lubeFactor = D.map(numGennies, 2, 7, 0.1, 0.8);
        } else if (numGennies > 24) {
          lubeFactor = D.options.maxWetness; //should kill most anything
        } else if (numGennies > 8) {
          lubeFactor = D.map(numGennies, 9, 24, 1.1, 8);
        }
        //give wetness to baby from parents (ew >.<)
        console.log(`lube factor: ${lubeFactor}, parents.A.wetness: ${parents.A.wetness}, parents.B.wetness: ${parents.B.wetness}`)
        let parentLubeA = Math.max(parents.A.wetness, 1) * parents.A.childInheritance; //prevents from negative wetness being passed on
        parents.A.wetness -= parentLubeA * lubeFactor; 
        let parentLubeB = Math.max(parents.B.wetness, 1) * parents.B.childInheritance;
        parents.B.wetness -= parentLubeB * lubeFactor;
        let inheritance = parentLubeA + parentLubeB;
        console.log(`lube factor: ${lubeFactor}, parentLubeA: ${parentLubeA}, parentLubeB: ${parentLubeB}, inheritance: ${inheritance}`)
        //make da bebe

        let newBaby = new Genny("baby", {parentA: parents.A, parentB: parents.B, inheritance: inheritance});
        // console.log("new baby at: " + JSON.stringify(newBaby.position));
        // console.log(`new baby: ${newBaby.name}`);
        // parents.A.offspring.push({name: newBaby.name})
        // parents.B.offspring.push({name: newBaby.name})
        gennies.push(newBaby);
        screen.emit("newGenny", newBaby);

        //check for drying out (dying) when left with negative wetness, turns into husk
        if (parents.A.wetness <= 0) {
          // parents.A.dryOut();
          parents.A.isHusk = true;
        }
        if (parents.B.wetness <= 0) {
          parents.B.isHusk = true;
        }
    });
}

function addRandomGenny(){
  // console.log("new genny from " + socket.id);
  // console.log(data);

  let xAxis = Math.floor(Math.random() * 16);
  let yAxis = Math.floor(Math.random() * 16);

  let data = {
  id: D.generateID(),
  poem: randomPoems[Math.floor(Math.random() * randomPoems.length)],
  body: 0, //on server, looks array [body, zones, hair]
  zones: 0,
  hair: 0,
  colors: [ D.randomHex(), D.randomHex(), D.randomHex() ],
  prolific: yAxis,
  prepared: 16 - yAxis,
  thirsty: xAxis,
  generous: 16 - xAxis,
  position: {x: 0, y: 0}, //will get overwritten
  }

  let newGenny = new Genny("client", data);
  gennies.push(newGenny);
  
  screen.emit("newGenny", newGenny);

  // console.log('new random Genny');
}

let randomPoems = [
  // "this is a test line of poetry",
  "forsooth, I dost dingle thou rizz",
  "red fish blue fish one fish two bitch",
  // "plus hydro glide for your eyeballs",
  // "yeah idk what this is all about",
  // "shit i forgot to take my vitamins",
  "wonderville is wonderful",
  "august why are you like this",
  "sometimes Todd, sometimes",
  "Todd regrets inviting me",
  "lick that ice cream off the cone", //shout out to Only Fire <3
  "lets do yoga on the bed",
  "do you want to bump uglies",
  "I'm kind of a big deal",
  // "boy just do what I said",
]
