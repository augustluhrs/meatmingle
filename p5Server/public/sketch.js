/*
    ~ * ~ * ~ * MOBILE 
    ~ * ~ * ~ * GENNY
    ~ * ~ * ~ * CREATION
    ~ * ~ * ~ * INTERFACE
*/

// COMM VARIABLES

//open and connect the input socket
let socket = io('/');

//listen for the confirmation of connection 
socket.on('connect', () => {
    console.log('now connected to server');
});

// UI VARIABLES

let font;

let canvas;
let statsDiv, colorDiv, readyDiv, nameDiv, yesDiv, noDiv;
let statsButton, colorButton, readyButton, nameInput;
let poemInput;
let yesButton, noButton;
let colorPickerPrimary, colorPickerSecondary, colorPickerHair;
let type = "";
let state = "stats";

let xAxis = Math.floor(Math.random() * 16);
let yAxis = Math.floor(Math.random() * 16);

let statsSlider = {
    xPos: 0, 
    yPos: 0,
    xVal: 0,
    yVal: 0,
    xCenter: 0,
    yCenter: 0,
    w: 0,
    h: 0
}

// GENNY VARIABLES

let genny = {
  primaryColor: randomHex(),
  secondaryColor: randomHex(),
  hairColor: randomHex(),
  prolific: yAxis,
  prepared: 16 - yAxis,
  thirsty: xAxis,
  generous: 16 - xAxis,
  position: {x: 0, y: 0}, //will get overwritten on server
}

//from defaults.js
/*
const displayScale = 1.8;
const finMin = 3 * displayScale;
const finMax = 40 * displayScale;
const widthMin = 10 * displayScale;
const widthMax = 80 * displayScale;
const lengthMin = 50 * displayScale;
const lengthMax = 100 * displayScale;
*/

function preload(){
  font = loadFont('assets/fonts/fugaz.ttf');
}

function setup(){
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.id("canvas");
    background(82,135,39);

    //layout
    ellipseMode(CENTER);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(RADIANS);
    textFont(font);
    textAlign(CENTER, CENTER);
    textSize(width/40);
    strokeWeight(2);

    //color pickers
    colorPickerPrimary = createColorPicker(genny.primaryColor).position(width/4, 5.5 * height/10).size(width/2, height/14);
    colorPickerPrimary.input(()=>{
        genny.primaryColor = colorPickerPrimary.value();
    });
    colorPickerPrimary.hide();
    colorPickerSecondary = createColorPicker(genny.secondaryColor).position(width/4, 6.5 * height/10).size(width/2, height/14);
    colorPickerSecondary.input(()=>{
        genny.secondaryColor = colorPickerSecondary.value();
    });
    colorPickerSecondary.hide();
    colorPickerHair = createColorPicker(genny.hairColor).position(width/4, 7.5 * height/10).size(width/2, height/14);
    colorPickerHair.input(()=>{
        genny.hairColor = colorPickerHair.value();
    });
    colorPickerHair.hide();

    //UI
    // nameInput = createInput("TYPE GENNY NAME").class("inputs").position(0, 0).size(width - 50, height/10);
    // nameInput.center("horizontal");
    poemInput = createInput("type a line of poetry here (max 16 words)").class("inputs").position(0, 0).size(width - 50, 2 * height/10);
    poemInput.center("horizontal");

    statsDiv = createDiv("").id("statsDiv").class("divs").position(0, 9 * height/10).size(width/3, height/10);
    statsButton = createButton("STATS").class("buttons").mousePressed(() => {
        state = "stats";
        colorPickerPrimary.hide();
        colorPickerSecondary.hide();
        colorPickerHair.hide();
    });
    statsButton.size(width/5, height/14).parent("statsDiv");

    colorDiv = createDiv("").id("colorDiv").class("divs").position(width/3, 9 * height/10).size(width/3, height/10);
    colorButton = createButton("COLOR").class("buttons").mousePressed(() => {
        state = "color";
        colorPickerPrimary.show();
        colorPickerSecondary.show();
        colorPickerHair.show();
    });
    colorButton.size(width/5, height/14).parent("colorDiv");

    readyDiv = createDiv("").id("readyDiv").class("divs").position(2*width/3, 9 * height/10).size(width/3, height/10);
    readyButton = createButton("READY").class("buttons").mousePressed(() => {
        state = "ready";
        yesButton.show();
        noButton.show();
        statsButton.hide();
        colorButton.hide();
        readyButton.hide();
        colorPickerPrimary.hide();
        colorPickerSecondary.hide();
        colorPickerHair.hide();
    });
    readyButton.size(width/5, height/14).parent("readyDiv");

    yesDiv = createDiv("").id("yesDiv").class("divs").position(0, 7 * height/10).size(width/2, height/10);
    yesButton = createButton("YES").class("buttons").parent("yesDiv").size(width/7, height/14).mousePressed(() => {
        // genny.name = nameInput.value();
        genny.poem = poemInput.value();

        //reset sizes? hmm....
        delete genny.bodyLength;
        delete genny.bodyWidth;
        delete genny.frontFinSize;
        delete genny.backFinSize;
        delete genny.position;
        
        socket.emit("sendGenny", genny);
        // nameInput.hide();
        poemInput.hide();
        yesButton.hide();
        noButton.hide();
        state = "done";
    });
    yesButton.hide();

    noDiv = createDiv("").id("noDiv").class("divs").position(width/2, 7 * height/10).size(width/2, height/10);
    noButton = createButton("NO").class("buttons").parent("noDiv").size(width/7, height/14).mousePressed(() => {
        yesButton.hide();
        noButton.hide();
        state = "stats";
        statsButton.show();
        colorButton.show();
        readyButton.show();
    });
    noButton.hide();

    //stats slider
    statsSlider = {
        xVal: genny.thirsty,
        yVal: genny.prolific,
        xCenter: width/2,
        yCenter: 6.75 * height / 10,
        w: 3 * height / 10,
        h: 3 * height / 10,
        xPos: map(genny.thirsty, 0, 16, width/2 - 3 * height / 10 / 2, width/2 + 3 * height / 10 / 2), 
        yPos: map(genny.prolific, 0, 16, 6.5 * height / 10 + 3 * height / 10 / 2, 6.5 * height / 10 - 3 * height / 10 / 2),
    }

    //genny info
    genny.position.x = width/2;
    genny.position.y = 3.5 * height / 10;
    type = checkType();
};

//
// MAIN
//

function draw(){
  if (state == "done"){
    push();
    // background(82,135,39); //green
    background(243,169,176); //pink
    stroke(0);
    fill(255);
    textSize(width/15);
    text("Genny off to get off!", width / 2, height / 4, width - 40);
    text("Refresh to make a new Genny!", width / 2, 3 * height / 4, width - 40);
    pop();
  } else {
    // background(82,135,39); //green
    background(243,169,176); //pink
    push();
    stroke(0);
    fill(255);
    // textSize(width/20);
    // text("the", width / 2, 1.65 * height / 10);
    textSize(width/15);
    text(type, width / 2, 4 * height / 10);
    pop();

    updateGenny();
    displayGenny(); //TODO tint
  }

  if (state == "stats"){
      type = checkType();
      displayStatsSlider();
  } else if (state == "color") {
      //nothing here, handled by buttons
  } else if (state == "ready") {
      push();
      textSize(width/20);
      text("Send this genny to the poem party?", width / 2, 6 * height / 10, width - 40);
      pop();
  }

}

function mouseDragged(){
    //for statsSlider
    if (state == "stats"){
        let ss = statsSlider;
        if(mouseX >= ss.xCenter - ss.w / 2 &&
        mouseX <= ss.xCenter + ss.w / 2 &&
        mouseY >= ss.yCenter - ss.h / 2 &&
        mouseY <= ss.yCenter + ss.h / 2) {
            ss.xPos = mouseX;
            ss.yPos = mouseY;
            ss.xVal = map(ss.xPos, ss.xCenter - ss.w / 2, ss.xCenter + ss.w / 2, 0, 16);
            ss.yVal = map(ss.yPos, ss.yCenter - ss.h / 2, ss.yCenter + ss.h / 2, 16, 0);
        }
    }
    
}

function updateGenny(){  
    //color updated in pickers
    genny.prolific = statsSlider.yVal;
    genny.prepared = 16 - statsSlider.yVal;
    genny.thirsty = statsSlider.xVal;
    genny.generous = 16 - statsSlider.xVal;
    /*
    genny.bodyLength = map(genny.generous, 16, 0, lengthMin, lengthMax);
    genny.bodyWidth = map(genny.generous, 0, 16, widthMin, widthMax);
    genny.frontFinSize = map(genny.prolific, 0, 16, finMin, finMax);
    genny.backFinSize = map(genny.prepared, 0, 16, finMin, finMax);
    */
}

function displayGenny(){
    push();
    translate(genny.position.x, genny.position.y);
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

function displayStatsSlider(){
    push();
    let ss = statsSlider;
    //background rectangle
    fill(166, 130, 172, 100);
    rect(ss.xCenter, ss.yCenter, ss.w, ss.h, 10); //rounded corners

    //axes
    stroke(0,100);
    line(ss.xCenter - ss.w / 2, ss.yCenter, ss.xCenter + ss.w / 2, ss.yCenter);
    line(ss.xCenter, ss.yCenter - ss.h / 2, ss.xCenter, ss.yCenter + ss.h / 2);

    //indicator ellipse
    stroke(0);
    fill(255);
    ellipse(ss.xPos, ss.yPos, ss.w / 12);

    //labels
    textSize(width/20);
    textAlign(CENTER, BOTTOM);
    text("prolific", ss.xCenter, ss.yCenter - ss.h / 1.9);
    textAlign(LEFT, CENTER);
    text("thirsty", ss.xCenter + ss.w / 1.9, ss.yCenter);
    textAlign(CENTER, TOP);
    text("prepared", ss.xCenter, ss.yCenter + ss.h / 1.9);
    textAlign(RIGHT, CENTER);
    text("generous",  ss.xCenter - ss.w / 1.9, ss.yCenter);

    pop();
}

function checkType(){
    let orientation = "";
    if (genny.prolific < 10 && genny.prepared < 10 && genny.thirsty < 10 && genny.generous < 10){
      orientation = "pillow princess";
    } else {

      if (genny.prolific > genny.generous && genny.generous > genny.thirsty){
        orientation = "zaddy";
      } else if (genny.generous > genny.prolific && genny.prolific > genny.prepared) {
        orientation = "hole"
      } else if (genny.generous > genny.prepared && genny.prepared > genny.prolific) {
        orientation = "service top"
      } else if (genny.prepared > genny.generous && genny.generous > genny.thirsty) {
        orientation = "orgy mom"
      } else if (genny.prepared > genny.thirsty && genny.thirsty > genny.generous) {
        orientation = "dungeon dom"
      } else if (genny.thirsty > genny.prepared && genny.prepared > genny.generous) {
        orientation = "sauna swiper"
      } else if (genny.thirsty > genny.prolific && genny.prolific > genny.prepared) {
        orientation = "relationship libertarian"
      } else {
        orientation = "breeder"
      }
    }
   
    return orientation;
}

function randomHex(){ // thanks https://css-tricks.com/snippets/javascript/random-hex-color/
    var randomColor = Math.floor(Math.random()*16777215).toString(16);
    return "#" + randomColor;
}
