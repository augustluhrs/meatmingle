//https://github.com/processing/p5.js/issues/3610
//https://editor.p5js.org/micuat/sketches/S82r42HqN


//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/screen');

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
});

socket.on('update', (data) => {
    school = data.school;
})

socket.on('baitToggle', (data) => {
    isBait = data;
});

socket.on('baitPos', (data) => { //data is a Victor
    baitPos.x = data.x;
    baitPos.y = data.y;
});

//
// SETUP AND VARIABLES
//

let gennies = [];
// let randomFishButton, clearFishButton;
let isBait = false;
let baitPos = {x: 0, y: 0};

function setup(){
    createCanvas(1920, 1080);
    
    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    // imageMode(CENTER);
    angleMode(RADIANS);
    // textFont(font);
    textAlign(CENTER, CENTER);
    noStroke();
    
    // background(82,135,39);
    // image(water, width/2, height/2, windowWidth, windowHeight);

    //UI
    // randomFishButton = createButton("RANDOM FISH").class("buttons").mousePressed(() => {socket.emit("randomFish")});
    // clearFishButton = createButton("CLEAR ALL FISH").class("buttons").mousePressed(() => {socket.emit("clearFish")});
};

//
// MAIN
//

function draw(){
    // image(water, 0, 0, windowWidth, windowHeight);
    
    background(0, 100, 100);

    for(let genny of gennies){
        showGenny(genny);
    }

    // if (isBait){
    //     image(bait, baitPos.x, baitPos.y, 60, 90);
    //     socket.emit("baitPos", {x: mouseX, y: mouseY});
    // }
}

function showGenny(genny){
    push();

    //rotation from direction
    translate(genny.position.x, genny.position.y);
    rotate(genny.direction + PI);

    //back fin
    fill(genny.secondaryColor);
    let back = genny.backFinSize;
    let offset = genny.bodyLength / 1.8;
    triangle(-back + offset, 0, back + offset, -back, back + offset, back);

    //body
    fill(genny.primaryColor);
    ellipse(0, 0, genny.bodyLength, genny.bodyWidth);

    //front fin
    fill(genny.secondaryColor);
    let front = genny.frontFinSize / 2;
    triangle(-front, 0, front, -front, front, front);

    //eye
    fill(0);
    ellipse((-genny.bodyLength / 2) + (genny.bodyLength / 8), 0, 10, 10);

    pop();
}

function mouseClicked(){
    if (mouseY < height){ //to prevent from triggering when clicking fish button
        // socket.emit('baitToggle');
    }
}
