/*
    ~ * ~ * ~ * SERVER
    ~ * ~ * ~ * 
    ~ * ~ * ~ * 
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
const Datastore = require('nedb');
let backupDB = new Datastore({filename: "databases/backup.db", autoload: true});
let ecosystemDB = new Datastore({filename: "databases/ecosystem.db", autoload: true});

//ecosystem variables
const D = require("./public/modules/defaults");
const Genny = require("./public/modules/genny");
const Lube = require("./public/modules/lube");
let gennies = [];
let lubeLocations = [];
// let updates = {
//   gennies: [],
//   lubeLocations: [],
// };

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

  socket.on("makeRandomGenny", () => {
    addRandomGenny();
  });

  socket.on("newLube", (data) => {
    lubeLocations.push(new Lube(D.options.lubeSize, data));
  });

  socket.on("getEcosystem", (socket) => { //when screen resets
    // console.log('sending screen the current gennies');
    for (let genny of gennies) {
      screen.emit("newGenny", genny); //hmm forgot emit rules TODO
    }
    // console.log('test');
  });
  
  /*
  socket.on("clearFish", () => {
    school = [];
  });

  socket.on("baitToggle", () => {
    isBait = !isBait;
    console.log("Bait: " + isBait);
    screen.emit("baitToggle", isBait);
  });

  socket.on("baitPos", (data) => {
    baitPos.x = lerp(baitPos.x, data.x, 0.4);
    baitPos.y = lerp(baitPos.y, data.y, 0.4);
    // let dataVec = new Victor(data.x, data.y);
    // baitVec.mix(dataVec, 0.4);
    screen.emit("baitPos", baitPos);
  });
  */

  //listen for this client to disconnect
  socket.on('disconnect', () => {
    // console.log('screen client disconnected: ' + socket.id);
  });
});

//
// SERVER LOOP
//

setInterval( () => {
  let updates = {
    gennies: [],
    lubeLocations: [],
  };

  //show all the lube
  lubeLocations.forEach( (lube) => {
    updates.lubeLocations.push(lube.display());
  });

  let mates = [];


  //feed and fuck
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

      genny.wetness += D.options.lubeSize + genny.lubeEfficiency;
      // console.log(critter.name + " has eaten: " + snack.id);
      // let snackQtree = this.qtree.points -- no way to remove? just going to add a property to food
      // let foodRange = new Circle(critter.position.x, critter.position.y, critter.r + 10);
      // this.qtree.remove(foodRange, snack, "ID");
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

  for (let genny of gennies) {
    updates.gennies.push(genny.display());
  }

  screen.emit("update", updates);
}, 10);

function checkForMates(mates) {
    //now the mates are triggering in flocking for quadtree usage, but the ecosystem makes babies here
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
        // parents.A.mateTimer += parents.A.refractoryPeriod;
        // parents.B.mateTimer += parents.B.refractoryPeriod;
        parents.A.mateTimer = 0;
        parents.B.mateTimer = 0;
        //give to baby from parents
        let parentLubeA = parents.A.wetness * parents.A.childInheritance;
        parents.A.wetness -= parentLubeA;
        let parentLubeB = parents.B.wetness * parents.B.childInheritance;
        parents.B.wetness -= parentLubeB;
        let inheritance = parentLubeA + parentLubeB;
        //make da bebe

        let newBaby = new Genny("baby", {parentA: parents.A, parentB: parents.B, inheritance: inheritance});
        // console.log("new baby at: " + JSON.stringify(newBaby.position));
        // console.log(`new baby: ${newBaby.name}`);
        // parents.A.offspring.push({name: newBaby.name})
        // parents.B.offspring.push({name: newBaby.name})
        gennies.push(newBaby);
        screen.emit("newGenny", newBaby);

        for (let genny of gennies) {
          if (genny.id == parents.A.id) {
            genny = parents.A;
          } else if (genny.id == parents.B.id) {
            genny = parents.B;
          }
        }
        // addCritterToDB(newBaby);
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

  console.log('new random Genny');
}

let randomPoems = [
  "this is a test line of poetry",
  "forsooth, I dost dingle thou rizz",
  "red fish blue fish one fish two bitch",
  "air optix plus hydraglyde for your eyeballs",
  "yeah idk what this is all about yeah idk what this is all about yeah idk what this is all about",
  "shit i forgot to take my vitamins"
]
