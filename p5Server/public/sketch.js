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
// let gennyLooks = []; //for storing image's tint/resize
let images = {
  body: [],
  zones: [],
  hair: []
}
//from defaults.js -- nvm, radius is only for displaying here, server maps it from .generous
// let minRadius = options.minRadius;
// let maxRadius = options.maxRadius;
let minRadius, maxRadius;

let canvas;
let statsDiv, colorDiv, readyDiv, nameDiv, yesDiv, noDiv;
let statsButton, colorButton, readyButton, nameInput;
let poemViewButton;
let poemInput;
let yesButton, noButton;
let colorPickerPrimary, colorPickerSecondary, colorPickerHair;
let type = "";
let state = "stats";
let isPoemValid = false;

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
  poem: "",
  body: 0, //on server, looks array [body, zones, hair]
  zones: 0,
  hair: 0,
  // looks: [], //images
  colors: [ randomHex(), randomHex(), randomHex() ],
  // primaryColor: randomHex(),
  // secondaryColor: randomHex(),
  // hairColor: randomHex(),
  prolific: yAxis,
  prepared: 16 - yAxis,
  thirsty: xAxis,
  generous: 16 - xAxis,
  radius: 100,
  // radius: options.minRadius * 1.5,
  position: {x: 0, y: 0}, //will get overwritten on server
}

function preload(){
  font = loadFont('assets/fonts/fugaz.ttf');
  images.body.push(loadImage("assets/body/blob1.png"));
  images.hair.push(loadImage("assets/hair/longHair.png"));
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
    // colorMode();
    
    minRadius = width/8;
    maxRadius = width/4;
    genny.radius = map(this.generous, 0, 16, minRadius, maxRadius);

    //images
    images.hair[0].resize(100, 0); //long hair
    images.hair[0].filter(INVERT);

    //color pickers
    colorPickerPrimary = createColorPicker(genny.colors[0]).position(width/4, 5.5 * height/10).size(width/2, height/14);
    colorPickerPrimary.input(()=>{
        genny.colors[0] = colorPickerPrimary.value();
    });
    colorPickerPrimary.hide();
    colorPickerSecondary = createColorPicker(genny.colors[1]).position(width/4, 6.5 * height/10).size(width/2, height/14);
    colorPickerSecondary.input(()=>{
        genny.colors[1] = colorPickerSecondary.value();
    });
    colorPickerSecondary.hide();
    colorPickerHair = createColorPicker(genny.colors[2]).position(width/4, 7.5 * height/10).size(width/2, height/14);
    colorPickerHair.input(()=>{
        genny.colors[2] = colorPickerHair.value();
    });
    colorPickerHair.hide();

    //UI
    poemInput = createInput("click to type a line of poetry here (2-12 words)").class("inputs").position(0, 0).size(width - 50, 1.5 * height/10);
    poemInput.center("horizontal");
    poemInput.elt.addEventListener('focus', function(event) { //thanks chat gpt
      event.target.value = '';
      event.target.removeEventListener('focus', arguments.callee)
    })
    poemInput.changed(()=>{
      //handling the valid check here
      if (genny.poem == "click to type a line of poetry here (2-12 words)" ||
          genny.poem.split(" ").length > 12 || genny.poem.length > 100 ||
          genny.poem.split(" ").length < 2 || 
          (genny.poem.split(" ").length == 2 && genny.poem.split(" ")[1] == "")){
        isPoemValid = false;
        poemInput.style('background-color', '#ee2222');
        readyButton.html("invalid poem");
      } else {
        isPoemValid = true;
        poemInput.style('background-color', '#6c702d');
        readyButton.html("create?");
      }
      // if (poemInput.value().length > 12 || poemInput.value() < 2) {
      //   poemInput.style('background-color', '#ee2222');
      // } else {
      //   poemInput.style('background-color', '#6c702d');

      // }
    })

    statsDiv = createDiv("").id("statsDiv").class("divs").position(0, 9 * height/10).size(width/3, height/10);
    statsButton = createButton("personality").class("buttons").mousePressed(() => {
        state = "stats";
        colorPickerPrimary.hide();
        colorPickerSecondary.hide();
        colorPickerHair.hide();
    });
    statsButton.size(width/5, height/14).parent("statsDiv");
    statsButton.position((statsDiv.width / 2) - (statsButton.width / 2), 0);


    colorDiv = createDiv("").id("colorDiv").class("divs").position(width/3, 9 * height/10).size(width/3, height/10);
    colorButton = createButton("looks").class("buttons").mousePressed(() => {
        state = "color";
        colorPickerPrimary.show();
        colorPickerSecondary.show();
        colorPickerHair.show();
    });
    colorButton.size(width/5, height/14).parent("colorDiv");
    colorButton.position((colorDiv.width / 2) - (colorButton.width / 2), 0);


    readyDiv = createDiv("").id("readyDiv").class("divs").position(2*width/3, 9 * height/10).size(width/3, height/10);
    readyButton = createButton(" ").class("buttons").mousePressed(() => {
      if(!isPoemValid){
        //hmm
      } else {
        state = "ready";
        yesButton.show();
        noButton.show();
        statsButton.hide();
        colorButton.hide();
        readyButton.hide();
        colorPickerPrimary.hide();
        colorPickerSecondary.hide();
        colorPickerHair.hide();
      }
        
    });
    readyButton.size(width/5, height/14).parent("readyDiv");
    readyButton.position((readyDiv.width / 2) - (readyButton.width / 2), 0);

    yesDiv = createDiv("").id("yesDiv").class("divs").position(0, 7 * height/10).size(width/2, height/10);
    yesButton = createButton("YES").class("buttons").parent("yesDiv").size(width/7, height/14).mousePressed(() => {
        genny.poem = poemInput.value();
        
        //need to limit poem length and/or sanitize
        if (genny.poem.split(" ").length > 12 || genny.poem.length > 100) {
          genny.poem = "I wrote a poem that was too long"; //lol test
        } 

        socket.emit("makeGenny", genny);
        poemInput.hide();
        yesButton.hide();
        noButton.hide();
        poemViewButton.show();

        state = "done";
    });
    yesButton.hide();

    noDiv = createDiv("").id("noDiv").class("divs").position(width/2, 7 * height/10).size(width/2, height/10);
    noButton = createButton("NO").class("buttons").parent("noDiv").size(width/7, height/14).mousePressed(() => {
        yesButton.hide();
        noButton.hide();
        poemViewButton.hide();
        state = "stats";
        statsButton.show();
        colorButton.show();
        readyButton.show();
    });
    noButton.hide();

    poemViewButton = createButton("go to poem view").class("buttons").mousePressed(() => {
      window.location.assign(window.location + "/poemview");
  });
  poemViewButton.position(width/2, height/2);
  poemViewButton.hide();
    //css font-size
    let inputs = document.getElementsByClassName('inputs');
    let classText = (width/30).toString() + "px";
    for (let input of inputs) {
      input.style.fontSize = classText;
    }
    let buttons = document.getElementsByClassName('buttons');
    for (let butt of buttons) {
      butt.style.fontSize = classText;
    }

    //stats slider
    statsSlider = {
        xVal: genny.thirsty,
        yVal: genny.prolific,
        xCenter: width/2 + 5, //slight off-center b/c mobile weird idk
        yCenter: 6.75 * height / 10,
        w: 3 * height / 10,
        h: 3 * height / 10,
        xPos: map(genny.thirsty, 0, 16, width/2 - 3 * height / 10 / 2, width/2 + 3 * height / 10 / 2), 
        yPos: map(genny.prolific, 0, 16, 6.5 * height / 10 + 3 * height / 10 / 2, 6.5 * height / 10 - 3 * height / 10 / 2),
    }

    //genny info
    genny.position.x = width/2;
    genny.position.y = 2.75 * height / 10;
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
    text("Your Genny's off to get off!", width / 2, height / 4, width - 40);
    text("Refresh to make a new Genny!", width / 2, 3 * height / 4, width - 40);
    pop();
  } else {
    // background(82,135,39); //green
    background(243,169,176); //pink
    push();
    stroke(0);
    strokeWeight(3);
    fill(255);
    // textSize(width/20);
    // text("the", width / 2, 1.65 * height / 10);
    textSize(width/15);
    text(type, width / 2, 4.25 * height / 10);
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
    genny.poem = poemInput.value();
    
    genny.prolific = statsSlider.yVal;
    genny.prepared = 16 - statsSlider.yVal;
    genny.thirsty = statsSlider.xVal;
    genny.generous = 16 - statsSlider.xVal;
    genny.radius = map(genny.generous, 0, 16, minRadius, maxRadius);
}

function displayGenny(){
    push();
    translate(genny.position.x, genny.position.y);
    //body fill
    push();
    // fill(genny.colors[0][0], genny.colors[0][1], genny.colors[0][2]);
    fill(genny.colors[0]);
    // fill(0);
    ellipse(0, 0, genny.radius); //i know it's not radius, shhhh
    pop();

    //zone fill
    push();
    // fill(genny.colors[1][0], genny.colors[1][1], genny.colors[1][2]);
    fill(genny.colors[1]);
    ellipse(0, 0 - genny.radius / 2, genny.radius / 3);
    pop();

    //hair fill
    push();
    // tint(genny.colors[2][0], genny.colors[2][1], genny.colors[2][2]);
    tint(genny.colors[2]);
    image(images.hair[0], 0, genny.radius / 3, genny.radius, genny.radius);
    pop();

    //face
    push();
    textFont('Verdana');
    textSize(genny.radius/3);
    let facePos = {x: 0, y: 0}; //????
    // text("👁️👄👁️", facePos.x, facePos.y);
    text("👁️👄👁️", 0, 0);
    pop();
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
    push();
    // stroke(0);
    noStroke();
    fill(108,112,45); //olive
    ellipse(ss.xPos - ss.w / 36, ss.yPos + ss.w / 12, ss.w / 12);
    ellipse(ss.xPos + ss.w / 36, ss.yPos + ss.w / 12, ss.w / 12);
    ellipse(ss.xPos, ss.yPos, ss.w / 12, ss.w/6);
    pop();

    //labels
    fill(255);
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
      } else if (genny.thirsty > genny.prepared && genny.prepared > genny.prolific) {
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
  let randomColor = "";
  while(randomColor.length !== 6) { //errors if 5
    randomColor = Math.floor(Math.random()*16777215).toString(16);
  }
  return "#" + randomColor;

}
