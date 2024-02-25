//stores common functions and variable options

const options = {
  minRadius: 50,
  maxRadius: 120,
  minSpeed: 1,
  maxSpeed: 7,
  minRefractory: 500,
  maxRefractory: 2000,
  minInheritance: 2,
  maxInheritance: 50,
  minLubeToMate: 5, //now making this global so prepared makes more sense
  // maxLubeToMate: 50,
  minLubeEfficiency: 1,
  maxLubeEfficiency: 100,
  maxWetness: 100, //upper range of dryness value
  mutationRate: 0.03,
  lubeTimer: 500,
  lubeSize: 10,
  dryRate: 1000, //how fast everyone dries out
  //no matetimer b/c that comes from refractory?
}

const ecoWidth = 1920;
const ecoHeight = 1080;

function map(n, start1, stop1, start2, stop2) {
  const newval = (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
  return newval;
}

function rand_bm(min, max) { // (box-mueller)
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
      num = randn_bm(min, max);
  } // resample between 0 and 1 if out of range
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}

//thanks to Tim Down https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function hexToHSL(hex) { //from chat-GPT
  // Convert hex to RGB first
  let rgb = hexToRGB(hex);
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;

  /*
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  } else {
    //some sort of error, replace with random to avoid breaking server
    
  }
  */
  // } else {
  //   throw new Error("Invalid hex color: " + hex);
  // }

  // Convert RGB to HSL
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  // return [h * 360, s * 100, l * 100];
  return [h, s, l]; //normalized
}

function generateID() { //grabbed from https://gist.github.com/gordonbrander/2230317 -- thanks!
  return '_' + Math.random().toString(36).substr(2, 9);
}

module.exports.options = options;
module.exports.ecoWidth = ecoWidth;
module.exports.ecoHeight = ecoHeight;
module.exports.map = map;
module.exports.rand_bm = rand_bm;
module.exports.hexToRGB = hexToRGB;
module.exports.hexToHSL = hexToHSL;
module.exports.generateID = generateID;
