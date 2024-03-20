# MEATMINGLE

***I guide the audience in making a collective poem using evolutionary algorithms in a generative ecosystem via little genital creatures going to an internet sex party. Confused? Me too.***

A generative poetry ecosystem where participants create genital critters, "gennies", whose DNA is a line of poetry, and send them off to a poetry play party. When the gennies are lubed up enough and their refractory period is reset, they cruise around until they find another willing genny and ~~redacted~~ until a new little genny pops out whose DNA poem line is a cross of the parents'.

*ITP Stupid Hackathon 2024* &&
*WordHack March 2024*

![screengrab of prototype karaoke queue](documentation/sometimespoem.png)

## Special Thanks

- Sara Dee
- Todd Anderson
- Dan Shiffman
- Harry Macinnis
- Tiri Kananuruk
- Allison Parrish
- Duncan Figurski
- Dave Currie
- Marcel Truxillo
- Schuyler DeVos
- Matt Ross
- Brent Bailey
- James Hosken
- John Bezark

![CLI showing early syllable check on crossover poem lines](documentation/yeahbitch.png)

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
  - [X] fix nuclear fission reproduction
  - [X] fix DNA poem in nuclear children
  - [X] fix string commas
  - [ ] fix rotation
  - [ ] fix face flip on X
  - [ ] add genny view to mobile interface
  - [ ] fix no reproduction when ready and touching
  - [X] add more separation when not ready
  - [ ] fix input line font size
  - [X] fix child hues
- [ ] p5 version updates
  - [ ] text box with lines that appear in a scroll bar window
  - [ ] population control
  - [ ] updated assets
    - [ ] bodies
    - [ ] zones
    - [ ] hair
    - [ ] lube (poppers too?)
    - [ ] background
  - [ ] asset tools
    - [ ] check generative stuff
    - [ ] check modular shapes
    - [ ] pixels/silhouettes censoring
  - [ ] misc
    - [X] random Genny button on screen
      - [X] random poem lines
    - [X] mutation word list
    - [X] new censor strategy
- [ ] musical version
  - [X] TTS p5.speech
  - [X] pronouncing syllable check
  - [ ] strudel? or ableton with some sort of sync?
  - [ ] animation to a beat
  - [ ] pitch adjustment auto-tune a la Harry
  - [ ] samples / loops
    - [ ] porn hub opening
    - [ ] careless whisper sax
    - [ ] 50 shades of grey weeknd chord
    - [ ] 808 loops
    - [ ] synth bass loops
    - [ ] nasty filter
- [ ] wand controller
  - [ ] why
- [ ] hosting
  - [ ] glitch test
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
- showing bounce of bounds (i've always said my sex life was like the game where you watch the DVD logo bounce around but it never quite hits the right spot)
- karaoke queue
  - chose these colors totally randomly

## Instructions

### Facilitating the Poem Party

- Don't put too much lube around, the gennies will get overwhelmed if surrounded by it lol.

### Arduino Tips

- On Windows, might need to install drivers for "USB Input Device" in order for the Nano 33 IoT to be used as a mouse.

### To Fork/Hack

- After installing the npm/yarn packages, you need to replace the obscenity/datasets in `node_modules` with those in `p5Server/obscenityDatasets`, or change them to your own filter preferences.

## Work Log

### Monday Notes

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

- performance
  - quadtree again? or just limit num of gennies / make survival harder?
  - what's easier, making a bunch of assets, or just giving people a canvas? then can do crossover of drawings too, which would be soooo satisfying... whole new layer... might even solve the tint issue since it might be easier to draw the lines than tint the images. though going to depend on how i end up tracking the lines... can i store points and just make lines? those should be less expensive than ellipse right?
  - or... do i dare... learn shaders...

- meat mingle title with bubble letters

- test on glitch to make sure everything works

- speech queue needs to be based on the gennies that exist, not just arbitrary repetition, esp. once gennies are gone. maybe locking the poems on the line box protects the genny from drying out? can highlight with good aura -- that way it also promotes the poem heading in a certain direction since they have a higher likelihood to reproduce (unless the wetness lost scales by number of offspring) (can't just give them infinite wetness b/c might go nuclear)

- test performance.now() vs millis()

- mate with more than two partners -- anyone who joins the puddle within the timelimit, the genny has words from all poems (might be too busy/nonsensical tho)

- fix syllable distribution over beat

### Tuesday Notes

- not sure why they're getting stuck on the right edge after resize. can't replicate it enough to isolate variables, but seems like has to be in flocking code -- either the bias ternaries I added or some error in the new ecoWidth? doesn't make sense. Luckily they still follow lube, so can just fix manually...

- tech list
  - mic on stand
  - aux out (need to check laptop...........)
  - test glitch

- after Dentist
  - add ecosystem pop limits
  - change poemQ to match karaoke, move blocks each bar
  - have karaoke queue
  - fix beat distro
  - click blocks to show options (or just have options always there?)
    - move up (or arrow key)
    - move down
    - kill
    - protect
    - lube
    - lube all
  - current block will highlight its genny
- later
  - check tone loop / beat
    - test performance.now()
  - test Ableton sync
- misc
  - new background
    - add something fun to the right edge since they all get stuck there
  - new genny assets
  - genny asset on mobile
  - random line on mobile from genny mutation list
  - emojis for lube
  - test optimization
  - check middleware for protecting server
- stretch
  - arduino to p5 (via TD?)
    - IMU? does what?
      - scrolls karaoke? is seek/avoid in party? deposits lube? i think that makes the most sense (lol)
    - button
      - seems like only makes sense in conjunction with IMU or joystick.
    - motor
      - would be fun to have it vibrate
  - test the bulkiness of using the breadboard
  - switch to RiTa.js so can analyze mutated word and replace with word that is the same type

### Wednesday Notes

- count word and syllable, so 9 words with one syllable spread out
- shader tests
  - cool background
  - glitch effect on sex to beat
  - using porn to fill shapes as texture
- sex timer
- mobile updates
- queue updates
  - blocks tracking karaoke
  - buttons on blocks
  - highlight genny that's being read
- UI
  - pause on server
  - ~~mute checkbox~~
  - clear lube button
  - hover to show genny stats
  - meat mingle title on karaoke queue
- music
  - ~~test aux out~~
  - test ableton sync with midi controller
  - test tone.js loop
  - mute button
  - ~~bpm visualizer for sync~~
  - bpm adjustment buttons
- vibe as mouse
- line drawing test
- glitch
  - upload
  - test server
  - test wifi
