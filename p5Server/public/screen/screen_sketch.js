


//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/screen');

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
});

socket.on('newGenny', (data) => {  
    console.log("new genny on screen: " + data.id);
    //image tint performance hack
    // https://github.com/processing/p5.js/issues/3610
    // https://editor.p5js.org/micuat/sketches/S82r42HqN    

    let genny = data;
    let gennyColors = [
        [genny.colors[0][0] * 360, genny.colors[0][1] * 100, genny.colors[0][2] * 100],
        [genny.colors[1][0] * 360, genny.colors[1][1] * 100, genny.colors[1][2] * 100],
        [genny.colors[2][0] * 360, genny.colors[2][1] * 100, genny.colors[2][2] * 100]
    ];

    /*
    //add images and tint/resize
    // let c = createGraphics(genny.radius * 2, genny.radius * 2);
    let c = createGraphics(100, 100);
    c.tint(gennyColors[0][0], gennyColors[0][1], gennyColors[0][2]);
    c.image(images.body[genny.looks[0]], c.width/2, c.height/2, genny.radius, genny.radius);
    
    //do i need unique graphics for each?
    
    // c.tint(gennyColors[1][0], gennyColors[1][1], gennyColors[1][2]);
    // c.image(images.body[genny.looks[1]], c.width/2, c.height/2, genny.radius, genny.radius);
    
    push();
    c.fill(gennyColors[1][0], gennyColors[1][1], gennyColors[1][2]);
    c.ellipse(c.width/2 + genny.radius / 2, c.height/2, genny.radius / 3);
    pop();

    c.tint(gennyColors[2][0], gennyColors[2][1], gennyColors[2][2]);
    c.image(images.body[genny.looks[2]], c.width/2, c.height/2, genny.radius, genny.radius);
    */
   
    // gennyLooks.push({id: genny.id, c: c, colors: gennyColors});
    gennyLooks.push({id: genny.id, colors: gennyColors});

    // console.log("new gennyLooks", c);
    
    //testing speech on creation
    if (isSpeechLoaded) {
        speech.speak(genny.poem);
    }

});

socket.on('update', (data) => {
    updates = data;
});

/*
socket.on('baitToggle', (data) => {
    isBait = data;
});

socket.on('baitPos', (data) => { //data is a Victor
    baitPos.x = data.x;
    baitPos.y = data.y;
});
*/

//
// SETUP AND VARIABLES
//

let gennyLooks = []; //for storing image's tint/resize
let updates = {
    gennies: [],
    lubeLocations: []
};
let lubeSize = 20;
// let randomFishButton, clearFishButton;
// let isBait = false;
// let baitPos = {x: 0, y: 0};

// p5.speech TTS
let speech;
let isSpeechLoaded = false; //silly but w/e, it's legible

//ui/display
// let aspectRatio = 16/9;
let font;
let images = {
    body: [],
    zones: [],
    hair: []
}

function preload(){
    // font = loadFont("../assets/fonts/fugaz.ttf");
    images.body.push(loadImage("../assets/body/blob1.png"));
    images.hair.push(loadImage("../assets/hair/longHair.png"));
    console.log("done loading assets");
}

function setup(){
    createCanvas(1920, 1080);
    // let canvasWidth = min(windowWidth, windowHeight * aspectRatio);
    // let canvasHeight = min(windowWidth / aspectRatio, windowHeight);
    // createCanvas(canvasWidth, canvasHeight);
    
    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(RADIANS);
    colorMode(HSL);
    // textFont(font);
    textAlign(CENTER, CENTER);
    noStroke();

    //asset resize
    images.body[0].resize(100, 100); //blob1
    images.hair[0].resize(100, 0); //long hair
    images.hair[0].filter(INVERT);

    //for face emojis
    // textSize(width/40);
    
    // background(82,135,39);
    // image(water, width/2, height/2, windowWidth, windowHeight);

    //UI
    // randomFishButton = createButton("RANDOM FISH").class("buttons").mousePressed(() => {socket.emit("randomFish")});
    // clearFishButton = createButton("CLEAR ALL FISH").class("buttons").mousePressed(() => {socket.emit("clearFish")});
    randomGennyButton = createButton("RANDOM GENNY").class("buttons").mousePressed(() => {socket.emit("makeRandomGenny")});

    //get ecosystem
    socket.emit("getEcosystem");
    // console.log(gennyLooks);
    
    //set up p5.speech
    // speech = new p5.Speech().onLoad(()=>{speech.speak("meat mingle")});
    speech = new p5.Speech('Microsoft Zira - English (United States)', ()=>{isSpeechLoaded = true;});
    // speech = new p5.Speech('Google US English', ()=>{console.log('dfdf')});
    
    
    // speech.speak("meat mingle")
};

//
// MAIN
//

function draw(){
    // image(water, 0, 0, windowWidth, windowHeight);
    background(250, 20, 50);
    // fill(255);
    // ellipse(0, 0, 300);

    for (let lube of updates.lubeLocations) {
        push();
        fill(255);
        ellipse(lube.pos.x, lube.pos.y, lubeSize);
        pop();
    }

    for(let gennyData of updates.gennies){
        showGenny(gennyData);
    }
    

    // if (isBait){
    //     image(bait, baitPos.x, baitPos.y, 60, 90);
    //     socket.emit("baitPos", {x: mouseX, y: mouseY});
    // }
}

function showGenny(gennyData){
    let pos = createVector(gennyData.pos.x, gennyData.pos.y);
    let genny = gennyData.genny;
    push();

    //rotation from direction
    translate(pos.x, pos.y);
    let rot = genny.direction + PI; //need to flip X if upside down
    let needsFlip = false;
    if (abs(rot) > PI) {
        needsFlip = true; //TODO
    }
    rotate(rot);

    // console.log(genny.colors);
    
    //use graphic
    for (let look of gennyLooks) {
        if (look.id == genny.id) {
            // console.log(genny.radius);
            // image(look.c, 0, 0, genny.radius * 2, genny.radius * 2); //TODO check
            
            //OR
            //body fill
            push();
            fill(look.colors[0][0], look.colors[0][1], look.colors[0][2]);
            ellipse(0, 0, genny.radius); //i know it's not radius, shhhh
            pop();

            //zone fill
            push();
            fill(look.colors[1][0], look.colors[1][1], look.colors[1][2]);
            ellipse(0 - genny.radius / 2, 0, genny.radius / 3);
            pop();

            //hair fill
            push();
            
            tint(look.colors[2][0], look.colors[2][1], look.colors[2][2]);
            image(images.hair[genny.looks[2]], 0, 0, genny.radius, genny.radius);
            pop();

            //face
            push();
            // stroke(0);
            textSize(genny.radius/3);
            // let facePos = {x: genny.pos.x, y: genny.pos.y};
            let facePos = {x: 0, y: 0};
            if (genny.isReadyToMate) {
                text("👁️👄👁️", facePos.x, facePos.y);
            } else if (genny.isHorny && genny.isTooDry) {
                text("🌵👄🌵", facePos.x, facePos.y);
            } else if (!genny.isHorny && !genny.isTooDry) {
                text("👁️⛔👁️", facePos.x, facePos.y);
            } else {
                //hurtin
                text("🌵⛔🌵", facePos.x, facePos.y);
            }
            pop();

            break;
        }

    }
    
    /*
    //body tint
    push();
    tint(genny.colors[0][0], genny.colors[0][1], genny.colors[0][2]);
    image(images.body[genny.looks[0]]);
    pop();

    //zone tint
    push();
    fill(genny.colors[1][0], genny.colors[1][1], genny.colors[1][2]);
    ellipse(pos.x + genny.radius / 2, pos.y, genny.radius / 3);
    // tint();
    // image();
    pop();

    //hair tint
    push();
    tint(genny.colors[2][0], genny.colors[2][1], genny.colors[2][2]);
    image();
    pop();
    */
    
    
    
    

    /*
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

    */
    pop();
}

function mouseClicked(){
    if (mouseY < height){ //to prevent from triggering when clicking fish button
        socket.emit('newLube', {x: mouseX, y: mouseY});
    }
}

//image tint performance hack
// https://github.com/processing/p5.js/issues/3610
// https://editor.p5js.org/micuat/sketches/S82r42HqN
// p5.Image.prototype.tint = function (r,g,b,a) {
//     let pg = createGraphics(width, height);
//         pg.tint(r,g,b,a==undefined?255:a);
//         pg.image(img1, 0, 0, width, height);

//     return pg;
// }
