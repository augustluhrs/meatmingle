/*
    ~ * ~ * ~ * SERVER
    ~ * ~ * ~ * 
    ~ * ~ * ~ * 
    ~ * ~ * ~ * 
*/

//create server
let port = process.env.PORT || 8080;
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

//creation client (mobile)
var inputs = io.of('/')
//listen for anyone connecting to default namespace
inputs.on('connection', (socket) => {
  console.log('new input client!: ' + socket.id);

  socket.on("makeGenny", (data) => {
    data.id = D.generateID();
    console.log("new genny from " + socket.id);
    console.log(data);
    let newGenny = new Genny("client", data);
    gennies.push(newGenny);
    
    screen.emit("newGenny", newGenny);
  });

  //listen for this client to disconnect
  socket.on('disconnect', () => {
    console.log('input client disconnected: ' + socket.id);
  });

});

//ecosystem screen
let screen = io.of('/screen');
screen.on('connection', (socket) => {
  console.log('new screen client!: ' + socket.id);

  socket.on("makeGenny", () => {
    addRandomGenny();
  });

  socket.on("getEcosystem", (socket) => { //when screen resets
    console.log('sending screen the current gennies');
    for (let genny of gennies) {
      screen.emit("newGenny", genny); //hmm forgot emit rules TODO
    }
    console.log('test');
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
    console.log('screen client disconnected: ' + socket.id);
  });
});

// SERVER LOOP
setInterval( () => {
  let updates = {
    gennies: [],
    lubeLocations: [],
  };

  let oldGennies = structuredClone(gennies);
  for (let genny of gennies) {
    genny.frolic(oldGennies, lubeLocations);

  }
  for (let genny of gennies) {
    updates.gennies.push(genny.display());
  }

  screen.emit("update", updates);
}, 10);


function addRandomGenny(){
  /*
  let xAxis = Math.floor(Math.random() * 16);
  let yAxis = Math.floor(Math.random() * 16);

  let stats = {
    name: "Fish " + school.length,
    primaryColor: D.randomHex(),
    secondaryColor: D.randomHex(),
    strength: yAxis,
    defense: 16 - yAxis,
    speed: xAxis,
    size: 16 - xAxis
  }

  school.push(new Fish(stats));
  */
  console.log("TODO");
  console.log('new Genny');
}
