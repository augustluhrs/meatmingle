/*
    ~ * ~ * ~ * VARIABLES
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
const Genny = require("./public/modules/genny");
let gennies = [];

var socket = require('socket.io');
var io = socket(server, {
  //this allows external websites to connect
  cors: {
    origin: true
  },
  //this allows older socket versions to connect
  allowEIO3: true
});

//creation client (mobile)
/*
io.sockets.on('connection', newConnection);

function newConnection(socket){  
  console.log("new connection from: " + socket.id);
  io.to(socket.id).emit("TD Test", {"hi": [0, 1, 2]});
  socket.on("sendGenny", function(data){
    io.emit("makeGenny", data);
  })
}
*/

var inputs = io.of('/')
//listen for anyone connecting to default namespace
inputs.on('connection', (socket) => {
  console.log('new input client!: ' + socket.id);

  socket.on("sendGenny", (data) => {
    gennies.push(new Genny(data));
    console.log("new genny from " + socket.id);
    console.log(data);
    io.emit("makeGenny", data);
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
    addRandomFish();
  });
  
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

  //listen for this client to disconnect
  socket.on('disconnect', () => {
    console.log('screen client disconnected: ' + socket.id);
  });
});
