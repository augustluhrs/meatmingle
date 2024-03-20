
// the vibe screen that's just the party, no speech or queue or controls, just sends lube messages

//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/vibe');

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
    // if (isSpeechLoaded) {
        // speech.speak(genny.poem);
    // }

    //add poem beats to queue 
    // poemQ.push({poem: genny.poem, id: genny.id, beats: genny.beats, isActive: false, diedMidLine: false});
    // addPoemBlock(genny.poem, genny.id);

});

socket.on('update', (data) => {
    updates = data;
});

//
// SETUP AND VARIABLES
//

let gennyLooks = []; //for storing image's tint/resize
let updates = {
    gennies: [],
    lubeLocations: [],
    husks: [],
    newHusks: [],
};
let lubeSize = 20;

// p5.speech TTS
let speech;
let isSpeechLoaded = false; //silly but w/e, it's legible
let beatInterval = 0;
let prevTime = 0;
let beat = 0;
let isPaused = false;
// let poemQ = []; //stores the lines to be read on beat, {id, beats}, recycles last two

//ui/display
let font;
let canvas;
let images = {
    body: [],
    zones: [],
    hair: []
}
let bgHue = 0;

//queue poem blocks
// let poemBlocks = []; //storing so can remove all when genny dies (unless protected)

function preload(){
    // font = loadFont("../assets/fonts/fugaz.ttf");
    images.body.push(loadImage("../assets/body/blob1.png"));
    images.hair.push(loadImage("../assets/hair/longHair.png"));
}

function setup(){
    // canvas = createCanvas(1080, 1080).class("divs"); //making room for panel
    canvas = createCanvas(1080, 1080); //making room for panel
    canvas.parent("page");
    // panel = createDiv().id("panel").parent("page");
    

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

    //get ecosystem
    socket.emit("getEcosystem");

};

//
// MAIN
//

function draw(){
    background(bgHue, 50, 80);

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
    

    // testVoiceLoop();
    // if (isSpeechLoaded && poemQ.length > 0 && !isPaused) {
    //     speech.setVolume((muteCheckbox.checked()) ? 0.0 : 1.0);
    //     beatLoop();
    // }

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

/*
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
            addPoemBlock(poemQ[0].poem, poemQ[0].id); //seems dumb to create two separate things, might get unlinked
        } 

        speech.speak(poemQ[0].beats[0]);
        // speech.speak("meat");

        poemQ[0].beats.splice(0, 1); //remove the beat that was just spoken
        if (poemQ[0].beats.length < 1) {
            //remove the karaoke block at the top (should be matching id...)
            //but only if genny is still alive, or else will throw error
            if (!poemQ[0].diedMidLine) {
                let topBlock = document.querySelector(`#panel .${poemQ[0].id}:first-child`);
                // console.log(document.querySelector(`#panel .${poemQ[0].id}:first-child`));
                // let topBlock = document.querySelector(`#panel :first-child`); //chat gpt for the query
                console.log(document.getElementById('panel').children);
                if (topBlock != null) {
                    topBlock.remove();
                } else {
                    console.log("wtf is happening");
                    console.log(poemQ[0]);
                    console.log(document.getElementById('panel').firstChild);
                } 
            }

            //remove line after last beat is spoken
            poemQ.splice(0, 1);
        } 

        if (beat == 4) {
            //new bar
            // prevBar = prevTime;
            beat = 1;
            bgHue += 360/8;
        }

        //trying a dumb bpm check to see if i can sync ableton
        
        // beatsElapsed++;
        // if (currentTime - lastMinute >= 60000) {
        //     lastMinute += 60000;
        //     minutesElapsed++;
        //     runningBPM = Math.fround(beatsElapsed / minutesElapsed);
        //     console.log(`beats: ${beatsElapsed}, mins: ${minutesElapsed}`);
        // }
    }
}
*/

