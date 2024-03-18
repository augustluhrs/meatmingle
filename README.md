# MEATMINGLE

***I guide the audience in making a collective poem using evolutionary algorithms in a generative ecosystem via little genital creatures going to an internet sex party. Confused? Me too.***

A generative poetry ecosystem where participants create genital critters, "gennies", whose DNA is a line of poetry, and send them off to a poetry play party. When the gennies are lubed up enough and their refractory period is reset, they cruise around until they find another willing genny and ~~redacted~~ until a new little genny pops out whose DNA poem line is a cross of the parents'.

*ITP Stupid Hackathon 2024* &&
*WordHack March 2024*

![CLI showing early syllable check on crossover poem lines](documentation/yeahbitch.png)

## Special Thanks

- Sara Dee
- Todd Anderson
- Dan Shiffman
- Harry Macinnis
- Tiri Kananuruk
- Allison Parrish
- Duncan Figurski
- Marcel Truxillo
- Schuyler DeVos
- Matt Ross
- Brent Bailey
- James Hosken

## Credits

### p5 client/server

- glitch hosting
- evolutionary algorithms from [Twitch Plays God](https://github.com/augustluhrs/Twitch_Plays_God) (originally from Dan Shiffman's [Nature of Code](https://natureofcode.com/))
- creation UI based on previous mobile client prototype for [Fist Fillet](https://github.com/augustluhrs/FishFight/)
- profanity filtering via [Obscenity](https://www.npmjs.com/package/obscenity)
- syllable detection via Allison Parrish's [Pronouncing.js](https://github.com/aparrish/pronouncingjs) library
- TTS thru Luke DuBois' [p5.speech](https://github.com/IDMNYU/p5.js-speech) library

### Assets

- [body blob 1](https://www.pinclipart.com/maxpin/ibJxoTm/)

## License

CC-BY-NC

## TODO

- [ ] Version 1 bug fixes
  - [ ] fix wetness / lube
  - [ ] fix nuclear fission reproduction
  - [X] fix DNA poem in nuclear children
  - [X] fix string commas
  - [ ] fix rotation
  - [ ] fix face flip on X
  - [ ] add genny view to mobile interface
  - [ ] fix no reproduction when ready and touching
  - [ ] add more separation when not ready
  - [ ] fix input line font size
- [ ] p5 version updates
  - [ ] text box with lines that appear in a scroll bar window
  - [ ] updated assets
    - [ ] bodies
    - [ ] zones
    - [ ] hair
    - [ ] lube (poppers too?)
    - [ ] background
  - [ ] asset tools
    - [ ] check generative stuff
    - [ ] check modular shapes
    - [ ] pixels/silhouettes
  - [ ] misc
    - [X] random Genny button on screen
      - [ ] random poem lines
    - [ ] mutation word list
    - [X] new censor strategy
- [ ] musical version
  - [X] TTS p5.speech
  - [ ] pronouncing syllable check
  - [ ] strudel? or ableton with some sort of sync?
  - [ ] animation to a beat
  - [ ] samples / loops
    - [ ] porn hub opening
    - [ ] careless whisper sax
    - [ ] 50 shades of grey weeknd chord
    - [ ] 808 loops
    - [ ] synth bass loops
    - [ ] nasty filter
- [ ] wand controller
  - [ ] why
- [ ] backup plans
  - [ ] hack defense
    - [ ] how to hide source code / prevent code from executing in console?
  - [ ] server fail safe
    - [ ] database
    - [ ] surface errors rather than crash
  - [ ] data base
    - [ ] clear button
- [ ] stretch research
  - [ ] unreal version
    - [ ] 3D models
    - [ ] animation
    - [ ] AI logic
    - [ ] websocket or OSC connection

### TIMELINE

Time

- 1 day for v1 Fixes
- .5 day for Assets
- .5 for Poem Box
________________

- 1 Day for wand controller
  
__________________

- 1 day for text to speech
- 1 day for syllable and queue
-  for music
   -  trigger signal from bpm

[Thursday]

[Friday]

[Saturday]

[Sunday]

[Monday]

[Tuesday]

[Wednesday]

- [ ]

[Thursday]

- [ ] Pack
- [ ] Tech Check
- [ ] PERFORM

- remove DNA
- rework mate/lube timers and flags
- add some sort of expiration (either from wetness or a chance after offspring -- might be better to do it that way so that the gennies are guaranteed at least one impact vs roaming around and never mating then dying. could still have it be a wetness thing, since it would make sense and be funny to show them being so dry that they just are a husk that blows away in the wind. the amount of wetness you lose on procreation )

## Intro

- CW: sex, procreation, poetry
- gennies do not have families, they have no platonic relationships.
- though in our world procreation is often not the byproduct or even goal of sex, for the gennies, their sex always results in a new genny joining the party.
- (explanation of stats)
- (showing a genny getting too dry and withering away)

## Instructions

### To Fork/Hack

- After installing the npm/yarn packages, you need to replace the obscenity/datasets in `node_modules` with those in `p5Server/obscenityDatasets`, or change them to your own filter preferences.

## Work Log

### Monday Marathon Pomodoros

- ~~DNA rework~~
- mating restrictions
- timer check and rework

- poems visual
- screen size
- mobile size
- highlight genny when poem is speaking
- visual of beat (bg color change? movement of gennies?)

- genny assets
- genny death animation
- genny mate animations
- genny movement adjustments (separation and speed)

- ~~try interval timing of speak()~~
- ~~split poem into 4 beat sections~~
- check strudel timing options
- click poem line in queue to interrupt and play

- control UI page
- sliders for mutation, flocking, timers
- override buttons
  - pause
  - kill one
  - set all wetness / refractory to ready
- hover on screen to show poem, timers

- vibe brainstorm
  - queue sampler tool (hovers over lines? button to play?)
