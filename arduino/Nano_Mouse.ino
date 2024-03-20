
/*
  Using Nano as USB mouse
  IMU acceleration controls X, Y
  button controls click
  
  August Luhrs 
  for meatmingle audience control
  March 2024
*/

// Mouse - Version: Latest 
#include <Mouse.h>

#include "Bounce2.h" //the button debounce library
//debounce buttons
#define CLICK_BUTTON 2
Bounce2::Button clickButton = Bounce2::Button();


#include "Arduino_LSM6DS3.h" //the IMU library
//IMU data
float x, y, z; //these store the accumulated readings
float _x, _y, _z; //these store the current readings
float baseX, baseY, baseZ; //these store the first readings taken, used to calibrate
float accThreshold = 2; //amount the acceleration needs to change, else too much noise
float maxRange = 5; //the default pos range, but will update if exceeded (to calibrate)
float mouseRange = 100; //what range to map xy to
float mappedX = 0; //these are used to map the readings to degrees that are then mapped to the mouse range
float mappedY = 0;
float mappedZ = 0;

//trying to eliminate the rubberbanding/blowback on movement stop
bool atRest = true;
int xDir = 0;
int yDir = 0;
int driftCount = 0;


//debugging
#define LED 13
int debugLED = LOW;

void setup() {
  //debugging
  Serial.begin(9600);

  //initialize IMU and print calibration data
  if(!IMU.begin()){
   Serial.println("failed to initialize IMU");
    while(1); //will stop your arduino from working until you reset
  } else {
    Serial.println("everything fine, IMU active");
  }

  //prints info about the IMU's gyroscope
  // Serial.print("Gyroscope sample rate = ");
  // Serial.print(IMU.gyroscopeSampleRate());
  Serial.print("Accelerometer sample rate = ");
  Serial.print(IMU.accelerationSampleRate());

  Serial.println(" Hz");
  Serial.println();
  Serial.println("Gyroscope in degrees/second");
  Serial.println("X\tY\tZ");
  // IMU.readGyroscope(_x, _y, _z);
  IMU.readAcceleration(_x, _y, _z);
  Serial.print(_x);
  Serial.print('\t');
  Serial.print(_y);
  Serial.print('\t');
  Serial.println(_z);
  //calibrate the initial degrees of the accelerometer
  baseX = _x;
  baseY = _y;
  baseZ = _z;
  
  //init debounce button
  clickButton.attach(CLICK_BUTTON, INPUT_PULLUP);
  clickButton.interval(5);
  clickButton.setPressedState(LOW);

  //init mouse
  Mouse.begin();

  //turn the on-board LED on to signal that the IMU initialized and everything in setup has finished (even when we don't have it plugged in to the serial monitor)
  pinMode(LED, OUTPUT);
  debugLED = HIGH;
  digitalWrite(LED, debugLED);
}

void loop() {
  //get current button reading
  clickButton.update();

  if(clickButton.pressed()){
    Serial.println("click");
    debugLED = !debugLED; //just to debug visually
    digitalWrite(LED, debugLED);
    Mouse.press(); //don't need to check for isPressed because that's what the debounce is for
  }

  if (clickButton.released()){
    Mouse.release();
  }

  //check for IMU movement
  /*
  * IMU
  * https://www.arduino.cc/reference/en/libraries/arduino_lsm6ds3/
  */
  if (IMU.accelerationAvailable()){ //first make sure the IMU is working
    IMU.readAcceleration(_x, _y, _z); //get the current values of the IMU
    //use the initial reading to offset the current reading and try to keep each around 0.00 when at rest
    //over time, the sensor will "drift" due to heat, so it'll never be perfectly reliable
    x = _x - baseX;
    y = _y - baseY;
    z = _z - baseZ;

    //check for drift

    
    /*
    Serial.print(_x);
    Serial.print('\t');
    Serial.print(_y);
    Serial.print('\t');
    Serial.println(_z);
    */
    //check to see if any pos has changed enough to send all three
    if (abs(x) > accThreshold || abs(y) > accThreshold || abs(z) > accThreshold){ 
      if(atRest){
        //first time, set Dirs
        atRest = false;
        if (y > 0) {
          xDir = 1;
        } else {
          xDir = -1;
        }

        if (z > 0) {
          yDir = 1;
        } else {
          yDir = -1;
        }
      }
      
      // float checkX = 0;
      // float checkY = 0;
      //im fried, this is so dumb
      if ((y > 0 && xDir == 1) || (y < 0 && xDir == -1)) {
        mappedX = map(y, -maxRange, maxRange, -mouseRange, mouseRange);
      } else {
        mappedX = 0;
      }
      if ((z > 0 && yDir == 1) || (z < 0 && yDir == -1)) {
        mappedY = map(z, -maxRange, maxRange, -mouseRange, mouseRange);
      } else {
        mappedY = 0;
      }

      Mouse.move(mappedX, mappedY, 0);
      // Mouse.move(y, z, 0);
      


      //check to see if we need to update the upper limit of the map range
      /*
      if (abs(x) > maxRange){
        maxRange = abs(x);
      }
      if (abs(y) > maxRange){
        maxRange = abs(y);
      }
      if (abs(z) > maxRange){
        maxRange = abs(z);
      }
      */

      //y motion = screen x axis motion
      //z motion = y axis motion
      // mappedX = floor(map(x, -maxRange, maxRange, -mouseRange, mouseRange));
      // mappedX = floor(map(y, -maxRange, maxRange, -mouseRange, mouseRange));
      // mappedY = floor(map(z, -maxRange, maxRange, -mouseRange, mouseRange));
      // mappedZ = floor(map(z, -maxRange, maxRange, -mouseRange, mouseRange));
      
      // mappedX = x;
      // mappedY = y;
      // mappedZ = z;

      //dumb but running out of time
      // int xPos = 0; //from y
      // int yPos = 0; //from z
      // if (y > accThreshold) {
      //   yPos 
      // }
      // Mouse.move(xPos, yPos, 0);

      //print
      // Serial.println("sent IMU pos: ");
      Serial.print("x:  ");
      Serial.print(mappedX);
      Serial.print("\ty:  "); // "\t" adds a tab of space
      Serial.println(mappedY);
      // Serial.print("x:  ");
      // Serial.print(mappedY);
      // Serial.print("\ty:  "); // "\t" adds a tab of space
      // Serial.print(mappedZ);
      // Serial.print("\tz:  ");
      // Serial.println(mappedZ);

      // Mouse.move(mappedX, mappedY, 0);
    } else if (!atRest) {
      atRest = true;
      Serial.println("\n\nAT REST\n\n");
    }
  } else {
    Serial.println("IMU not working");
    Serial.println(IMU.accelerationAvailable());
    Serial.println(IMU.gyroscopeAvailable());
    delay(2000); //freezes the loop for 2 seconds and then restarts loop()
  }

  delay(10); //just a little buffer to give the hardware time to catch up to the code (software)
}
