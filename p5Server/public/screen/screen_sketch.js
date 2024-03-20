


//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/screen');

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
});

socket.on('changeSettings', (data)=>{
    beatInterval = data.beatInterval;
});

socket.on('newGenny', (data) => {  
    // console.log("new genny on screen: " + data.id);
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
        // speech.speak(genny.poem);
    }

    //add poem beats to queue 
    poemQ.push({id: genny.id, beats: genny.beats, isActive: false});
    addPoemBlock(genny.poem, genny.id);

});

socket.on('update', (data) => {
    updates = data;

    //if any gennies have dried out, remove their poem from the queue
    if (data.newHusks.length > 0) {
        for (let newHuskID of data.newHusks) {
            //remove from beat Queue
            for (let i = poemQ.length - 1; i >= 0; i--) {
                let p = poemQ[i];
                if (p.id == newHuskID && !p.isActive) { //prevents beat from getting off if current line is from husk
                    poemQ.splice(i, 1);
                }
            }
            // remove from karaoke panel
            // for (let i = )
            //not sure if this will bug out if removed while dragging block TODO test
            let huskBlocks = document.getElementsByClassName(newHuskID);
            huskBlocks.forEach( (hb)=>{
                hb.remove();
            });

        }
    }
});

//
// SETUP AND VARIABLES
//

let gennyLooks = []; //for storing image's tint/resize
let updates = {
    gennies: [],
    lubeLocations: []
};
let lubeSize = 20;

// p5.speech TTS
let speech;
let isSpeechLoaded = false; //silly but w/e, it's legible
let beatInterval = 0;
let prevTime = 0;
let beat = 0;
let isPaused = false;
let poemQ = []; //stores the lines to be read on beat, {id, beats}, recycles last two

//ui/display
let font;
let canvas;
let randomGennyButton, pauseButton, resumeButton, clearLubeButton; //buttons
let muteCheckbox; //checkboxes
let images = {
    body: [],
    zones: [],
    hair: []
}
let bgHue = 0;

//queue poem blocks
let poemBlocks = []; //storing so can remove all when genny dies (unless protected)

function preload(){
    // font = loadFont("../assets/fonts/fugaz.ttf");
    images.body.push(loadImage("../assets/body/blob1.png"));
    images.hair.push(loadImage("../assets/hair/longHair.png"));
}

function setup(){
    // canvas = createCanvas(1080, 1080).class("divs"); //making room for panel
    canvas = createCanvas(1080, 1080); //making room for panel
    canvas.parent("page");
    panel = createDiv().id("panel").parent("page");
    

    // createCanvas(1920, 1080);
    // let canvasWidth = min(windowWidth, windowHeight * aspectRatio);
    // let canvasHeight = min(windowWidth / aspectRatio, windowHeight);
    // createCanvas(canvasWidth, canvasHeight);
    
    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(RADIANS);
    colorMode(HSL, 360, 100, 100, 1);
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
    pauseButton = createButton("pause").class("buttons").mousePressed(() => {
        socket.emit("pause");
        isPaused = true;
        speech.pause();
    });
    resumeButton = createButton("resume").class("buttons").mousePressed(() => {
        socket.emit("resume");
        isPaused = false;
        speech.resume();
    });
    clearLubeButton = createButton("clearLube").class("buttons").mousePressed(() => {
        socket.emit("clearLube");
    });
    muteCheckbox = createCheckbox("mute voice", false).class('buttons');



    //get ecosystem
    socket.emit("getEcosystem");
    // console.log(gennyLooks);
    
    //set up p5.speech
    speech = new p5.Speech('Microsoft Zira - English (United States)', ()=>{isSpeechLoaded = true;});
    speech.interrupt = true; //hmm bugging out
    speech.setPitch(0.3); //low
    speech.setRate(1.5); //fast
    
    // speech.speak("meat mingle")
};

//
// MAIN
//

function draw(){
    // image(water, 0, 0, windowWidth, windowHeight);
    // background(250, 20, 50);
    background(bgHue, 50, 80);
    // fill(255);
    // ellipse(0, 0, 300);

    //show dried out husks
    for (let husk of updates.husks) {
        push();
        translate(husk.pos.x, husk.pos.y);
        textSize(husk.radius/3);
        fill(200, 5, 50, husk.fade);
        ellipse(0, 0, husk.radius);
        // text("❌〰️❌", 0, 0);
        text("➰〰️➰", 0, 0);
        pop();
    }

    push();
    textSize(30);
    for (let lube of updates.lubeLocations) {
        // fill(255);
        // ellipse(lube.pos.x, lube.pos.y, lubeSize);
        text(lube.emoji, lube.pos.x, lube.pos.y);
    }
    pop();

    for(let gennyData of updates.gennies){
        showGenny(gennyData);
    }
    
    // speech.speak("meat meat meat meat");

    // testVoiceLoop();
    if (isSpeechLoaded && poemQ.length > 0 && !isPaused) {
        speech.setVolume((muteCheckbox.checked()) ? 0.0 : 1.0);
        beatLoop();
    }

    //bpm check
    // text(runningBPM, 10, 10);
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
            let facePos = {x: 0, y: 0}; //????
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
    if (mouseY < height && mouseX < width) {
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

let runningBPM = 0;
let beatsElapsed = 0;
let minutesElapsed = 0;
let lastMinute = 0;
function beatLoop() { //auto from poemQ
    let currentTime = millis();
    if (currentTime - prevTime >= beatInterval) { //hmm will this actually be on beat or will it depend on loop/browswer?
        prevTime = currentTime;
        beat++;

        // console.log(poemQ);
        // if (poemQ.length < 2) {
            //will only happen once per bar since by definition adding will increase length
            // poemQ.push(poemQ[0].slice());
        // }

        //now adding the line to end of queue no matter what, since will get removed on drying out
        if (!poemQ[0].isActive) {
            poemQ.push(structuredClone(poemQ[0]));
            poemQ[0].isActive = true;
        }

        speech.speak(poemQ[0].beats[0]);
        // speech.speak("meat");

        poemQ[0].beats.splice(0, 1); //remove the beat that was just spoken
        if (poemQ[0].beats.length < 1) {
            poemQ.splice(0, 1); //remove line after last beat is spoken
        } 

        if (beat == 4) {
            //new bar
            // prevBar = prevTime;
            beat = 1;
            bgHue += 360/8;
        }

        //trying a dumb bpm check to see if i can sync ableton
        /*
        beatsElapsed++;
        if (currentTime - lastMinute >= 60000) {
            lastMinute += 60000;
            minutesElapsed++;
            runningBPM = Math.fround(beatsElapsed / minutesElapsed);
            console.log(`beats: ${beatsElapsed}, mins: ${minutesElapsed}`);
        }
        */
    }
}

// let prevTime = 0;
let interval = 1905; //126 bpm (MAMI) = 2.1 per second, so each 4 beat bar is ~1905ms
function testVoiceLoop(){
    let currentTime = millis();
    if (currentTime - prevTime >= interval) {
        prevTime = currentTime;
        speech.speak("meat meat meat meat")
    }        
}

//for adding to queue panel
function addPoemBlock(poem, id){
    // let newBlock = createDiv(poem).class(`poemBlock ${id}`).parent("panel");
    let newBlock = createDiv(poem).class(`poemBlock`).parent("panel");
    newBlock.setAttribute('data-id', id);

    poemBlocks.push(newBlock);
}

