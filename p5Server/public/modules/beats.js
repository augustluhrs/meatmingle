//beat bar for speech timing

//pronouncing for beat bar function
// const Pron = require('pronouncing');
const Pron = require('../libraries/pronouncing');
const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;

let beats = 4;
let bpm = 126;
let beatInterval = ((beats / (bpm/60)) / beats) * 1000 * 2; //right now can't change in script, and going slow for test

// function setBeat(_beats, _bpm) {
//   beatInterval = ((_beats / (_bpm/60)) / _beats) * 1000;
// }
function countSyllablesInWord(word){
  let phones = Pron.phonesForWord(word);
  let count = 1;
  if (phones.length > 0) {
    count = Pron.syllableCount(phones[0]);
  } 
  return count;
}

function splitPoemForBar(poem){
  let poemBeats = [];
  let poemSplit = poem.split(" ");
  let poemSyllables = [];
  let syllables = 0;
  let words = 0;

  //take four equal chunks by syllable count
  for (let word of poemSplit) {
    let poemSyllableObj = {
      word: word, 
      syllables: 0
    };
    let count = countSyllablesInWord(word);
    syllables += count;
    words++;
    /*
    let phones = Pron.phonesForWord(word);
    let count = 1;
    if (phones.length > 0) {
      count = Pron.syllableCount(phones[0]);
      syllables += count;
    } else {
      syllables++; //hmm what's a better way to guess if CMU Dict doesn't know word?
    }
    */
    poemSyllableObj.syllables = count;
    poemSyllables.push(poemSyllableObj);
  }
  // console.log("syllable split");
  console.log(`syllables: ${syllables}` );
  console.log(poemSyllables);

  //need to have a syllable tally while going through array, add once reaches limit, rest in last element
  let targetNumSyllables = syllables / beats; //avg num of syllables per beat
  let targetNumWords = words / beats;
  // console.log(poemSyllables)
  while (poemSyllables.length > 0) {
    let tally = 0;
    // let beat = 1; //not starting at 0 >.<
    let poemBeat = [];
    // let notSkippingWord = true;

    // while (((tally < targetNumSyllables || poemBeats.length == 3) && poemSyllables.length > 0) && notSkippingWord) {
    while (tally < targetNumWords) { //ugh
      //if under syllable count for this section or if last section, and there are still words to add
      tally++;

      // let nextWord = poemSyllables[0];

      if (poemSyllables.length != 0) { //help me
        // console.log(poemSyllables[0]);
        poemBeat.push(poemSyllables[0].word);
        poemSyllables.splice(0, 1);
      }

      // let nextWord = poemSyllables[0];
      // if (tally + nextWord.syllables >= targetNumSyllables * 2 && poemBeats.length < beats - 1) {
        //trying to distribute words more evenly since multisyllable words coming after monosyllable words can skew to a front-loaded bar
        // // continue;
        // notSkippingWord = false;
      // } else {
        // tally += nextWord.syllables;
        // poemBeat.push(nextWord.word);
        // poemSyllables.splice(0, 1);
      // }
    
    }
    // console.log(poemSyllables);
    let fullBeat = poemBeat.join(" ");
    fullBeat.replace(punctuationRegex, " ");
    poemBeats.push(fullBeat);
  }

  if (poemBeats.length < beats) {
    // console.log("not enough words for four beats");
    for (let i = 1; i < beats; i++) {
      //this would never be 0 right? that would mean empty poem...
      if (poemBeats[i] == undefined) {
        poemBeats[i] = "";
      }
    }
  }

  // console.log("poemBeats");
  console.log(poemBeats);
  return poemBeats; //gets added to queue as array of four mini poems
}

module.exports.beatInterval = beatInterval;
module.exports.splitPoemForBar = splitPoemForBar;
module.exports.countSyllablesInWord = countSyllablesInWord;
