


//  SOCKET SERVER STUFF
//

//open and connect the input socket
let socket = io('/poemView');
let id;
//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
    id = socket.id;
});

socket.on('newGenny', (data) => {  
    let genny = data;

    addPoemDiv(genny, false, 'poem');
});

// socket.on('update', (data) => {
//     updates = data;

//     //if any gennies have dried out, remove their poem from the queue
//     if (data.newHusks.length > 0) {
//         for (let newHuskID of data.newHusks) {

//             if (poemQ[0].id == newHuskID) {

//             } else {
//                 for (let [i, p] of poemQ.entries()) {
//                     if (poemQ.id == newHuskID) {
//                         poemQ
//                     }
//                 }
//             }

//             //OLD SHITTTTTT

//             /*
//             //remove from beat Queue
//             let ignoreTop = false;
//             for (let i = poemQ.length - 1; i >= 0; i--) {
//                 let p = poemQ[i];
//                 if (p.id == newHuskID && !p.isActive) { //prevents beat from getting off if current line is from husk
//                     if (p.isActive) {
//                         //the current line being spoken needs to be removed, but will cause errors
//                         p.diedMidLine = true;
//                         ignoreTop = true;
//                     } else {
//                         poemQ.splice(i, 1);
//                     }
//                 }
//             }
//             // remove from karaoke panel
//             // for (let i = )
//             //not sure if this will bug out if removed while dragging block TODO test
//             //need to check to make sure not the top line
//             if (!ignoreTop) {
//                 let huskBlocks = document.getElementsByClassName(newHuskID);
//                 huskBlocks.forEach( (hb)=>{
//                     hb.remove();
//                 });
//             } else {
//                 //need to only iterate through the children below top? hmm...  seems like I'm doing this a dumb way
//                 let parent = document.getElementById('panel');
//                 let children = parent.children;
//                 children.forEach ((child)=>{
//                     if (parent.firstChild != child) {
//                         child.remove();
//                     } else {
//                         console.log('worked i think')
//                     }
//                 })
//             }
//             */
            

//         }
//     }
// });

//
// TONE.JS
//



//  synths.forEach(synth => synth.connect(gain));

//
// SETUP AND VARIABLES
//

// p5.speech TTS
let speech;
let isSpeechLoaded = false; //silly but w/e, it's legible
let beatInterval = 0;
let prevTime = 0;
// let beat = 0;
let isPaused = false;
let poemQ = []; //stores the lines to be read on beat, {id, beats}, recycles last two

//ui/display
let font;
let canvas;
// let bg; //image
let bgHue = 0;
// let count = 0;


//queue poem blocks
// let poemBlocks = []; //storing so can remove all when genny dies (unless protected)

function preload(){
    // font = loadFont("../assets/fonts/fugaz.ttf");
    // images.body.push(loadImage("../assets/body/blob1.png"));
    // images.background.push(loadImage("../assets/background/pillows4_light.jpeg"));
    // images.hair.push(loadImage("../assets/hair/longHair.png"));
}

function setup(){
    // canvas = createCanvas(1080, 1080).class("divs"); //making room for panel
    canvas = createCanvas(windowWidth, windowHeight); //making room for panel
    // canvas.parent("page");
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

    //get ecosystem
    
    socket.emit("getEcosystemPoem", {id: id});
};

//
// MAIN
//

/*
function draw(){
    // image(water, 0, 0, windowWidth, windowHeight);
    image(images.background[0], width/2, height/2, width, height);
    // background(250, 20, 50);
    // background(bgHue, 50, 80);
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
        // beatLoop();
    } 

    //bpm check
    // text(runningBPM, 10, 10);

    
}
*/
/*
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
    // rotate(rot);

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
            ellipse(0, 0 - genny.radius / 2, genny.radius / 3);
            pop();

            //hair fill
            push();
            
            tint(look.colors[2][0], look.colors[2][1], look.colors[2][2]);
            image(images.hair[genny.looks[2]], 0, genny.radius / 3, genny.radius, genny.radius);
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
                text("👁️💤👁️", facePos.x, facePos.y); //"⛔"
            } else {
                //hurtin
                text("🌵💤🌵", facePos.x, facePos.y);
            }
            pop();

            break;
        }

    }
    
    
    // //body tint
    // push();
    // tint(genny.colors[0][0], genny.colors[0][1], genny.colors[0][2]);
    // image(images.body[genny.looks[0]]);
    // pop();

    // //zone tint
    // push();
    // fill(genny.colors[1][0], genny.colors[1][1], genny.colors[1][2]);
    // ellipse(pos.x + genny.radius / 2, pos.y, genny.radius / 3);
    // // tint();
    // // image();
    // pop();

    // //hair tint
    // push();
    // tint(genny.colors[2][0], genny.colors[2][1], genny.colors[2][2]);
    // image();
    // pop();
    
    pop();
}
*/
function mouseClicked(){
    if (mouseY < height && mouseX < width) {
        // socket.emit('newLube', {x: mouseX, y: mouseY});
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



let generationColors = [
    "#f0c5c4", //pale pink
    "#f47cdb", //fuschia
    "#b07cf4", //lavender
    "#7c9ff4", //cornflower
    "#7cf4f1", //cyan
    "#50feac", //mint
    "#6cb530", //apple
    "#85a403", //olive
    "#f1cb3c", //gold
]

function addPoemDiv(genny, isHusk, parent) {
    //removes/adds to karaoke queue unless husk, then removes from queue and adds to poem
    let newDiv = createDiv(genny.poem).class('poemDiv').parent(parent).id(genny.id);
    // rn limiting to max color 9 generations
    // console.log(genny.generations);

    genny.generations[0] = Math.min(genny.generations[0], generationColors.length - 1);
    genny.generations[1] = Math.min(genny.generations[1], generationColors.length - 1);

    // console.log(genny.generations);
    document.getElementById(genny.id).style.backgroundImage = `linear-gradient(to right, ${generationColors[genny.generations[0]]}, ${generationColors[genny.generations[1]]})`;
    // newDiv.style('background', `linear-gradient(to right, ${generationColors[genny.generations[0]]}, ${generationColors[genny.generations[1]]})` )

    if (parent == "poem") {
        document.querySelector('#poem').insertBefore(newDiv.elt, parent.firstChild);
    }
}
