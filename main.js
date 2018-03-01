/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var TJBot = require('tjbot');
var morse = require('./morse.js')
var config = require('./config');

//Visual recognition info

var watson = require('watson-developer-cloud');
var fs = require('fs');


  //Morse code alphabet

var morse = {
	A :	".-",
	B :	"-...",
	C :	"-.-.",
	D	:	"-..",
	E	:	".",
    F :   "..-.",
    G	:	"--.",
    H :   "....",
	I	:   "..",
    J :   ".---",
	K	:   "-.-",
	L	:	".-..",
    M :	"--",
    N :	"-.",
    O	:   "---",
    P :   ".--.",
    Q	:   "--.-",
    R	:   ".-.",
    S	:	"...",
    T	:	"-",
    U	:	"..-",
    V	:   "...-",
    W	:   ".--",
    X	:   "-..-",
    Y	:   "-.--",
    Z	:   "--..",
    0	:   "-----",
    1	:   ".----",
    2	:   "..---",
    3	:   "...--",
    4	:   "....-",
    5	:   ".....",
    6	:   "-....",
    7 :   "--...",
    8	:   "---..",
    9	:   "----."
};

// obtain our credentials from config.js
var credentials = config.credentials;


var visual_recognition = watson.visual_recognition({
  api_key: '{b731d82138f503544ea4420f795b00ff5c864203}',
  version: 'v3',
  version_date: '2016-05-20'
  });

// these are the hardware capabilities that our TJ needs for this recipe
var hardware = ['led', 'microphone', 'servo', 'speaker', 'camera'];
var WORKSPACEID = config.conversationWorkspaceId;
// set up TJBot's configuration
var tjConfig = {
    log: {
        level: 'verbose'
    },speak: {
    speakerDeviceId: "plughw:2,0"
  }, robot: {

    name : 'Rafa'

  }
};

// instantiate our TJBot!
var tj = new TJBot(hardware, tjConfig, credentials);
//Morse code dot duration

var dot_duration = 500;
// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
var tjColors = tj.shineColors();

//console.log("I understand lots of colors.  You can tell me to shine my light a different color by saying 'turn the light red' or 'change the light to green' or 'turn the light off'.");
console.log(tj.configuration.robot.name);
console.log("Say Hi David to activate me!");
// uncomment to see the full list of colors TJ understands
// console.log("Here are all the colors I understand:");
// console.log(tjColors.join(", "));

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
var colors = {};
tjColors.forEach(function(color) {
    colors[color] = 1;
});

tj.shine("off");
// listen for speech
main();




function main(){
  console.log("Again in main");
  tj.listen(function(msg) {

      var containsTurn = msg.indexOf("turn") >= 0;
      var containsChange = msg.indexOf("change") >= 0;
      var containsSet = msg.indexOf("set") >= 0;
      var containsLight = msg.indexOf("the light") >= 0;
      var containsDisco = msg.indexOf("disco") >= 0;




      if ((containsTurn || containsChange || containsSet) && containsLight) {
          // was there a color uttered?
          var words = msg.split(" ");
          for (var i = 0; i < words.length; i++) {
              var word = words[i];
              if (colors[word] != undefined || word == "on" || word == "off") {
                  // yes!
                  tj.shine(word);
                  break;
              }
          }
      } else if(msg.startsWith("hi "+ tj.configuration.robot.name)) { //Introducing the bot
  tj.stopListening();
          tj.wave();
        tj.shine("green");
  	     //tj.speak("Hello Buddy, I am listening. Say camera for taking a picture, code to talk to you in morse, move to shake those hips, relax to play some ambience music or feel to match your feeling");
			tj.speak("Let's go toons! Sheerah!");
         tj.listen(function(msg){
           console.log("Listening");
       if(msg.indexOf("code")>=0){
         tj.stopListening();
         tj.speak("Say something like matrix, self, pills. Dots will be purple, dashes will be orange and spaces between letters will be blue");
         tj.listen(function(msg){
        tj.converse(WORKSPACEID, msg, function(response){

        var message =  response.description.toUpperCase();
        tj.pauseListening();
        console.log(message);
        var split_msg = message.split(""); // "Hello" -> split_msg = [H, E, L, L, O ]
        var code = "";
        var length = parseInt(split_msg.length);
        console.log(split_msg.length);
        console.log(typeof(split_msg.length));
        for(i = 0; i<length; i++){
            console.log("IN");
            console.log(split_msg[i]);
          if((morse[split_msg[i]])){ // morse[""]
            code = morse[split_msg[i]];
            console.log("The type of code is " + typeof(code));
            console.log("The morse code for " + split_msg[i]+ " is " + code);
        //    var msg_code  = code.split(''); // code = ".-"

            for( j = 0; j<code.length; j++){ // msgcode = [. , -]

              var item = code.charAt(j);
              console.log("The type of item is " + item);
              if(item == '.'){
                tj.shine("purple");
                console.log("DOT");

                tj.lowerArm();
                tj.sleep(dot_duration-200);
                tj.raiseArm();
                tj.shine("off");
                tj.sleep(400);
              }else if(item == '-'){
                   tj.shine("orange");
                console.log("DASH");
                tj.lowerArm();
                tj.sleep(dot_duration*3);
                tj.raiseArm();
                 tj.shine("off");
                tj.sleep(400);
              }

        }
        console.log("Sleeping");
        tj.shine("blue");
        tj.sleep(600);

        }
        }

        });


        if(msg.indexOf("start")>=0){
          tj.stopListening();
          main();
        }else if(msg.indexOf("close")>=0){
          goodbye();
        }
       });
        }
  else if(msg.indexOf("move")>=0){
                  dance();
      }
      else if(msg.indexOf("relax")>=0){
        chill();
      }

      else if(msg.indexOf("feel")>= 0){

        feel();

      }else if(msg.indexOf("camera")>=0){

            eye();

  }else if(msg.indexOf("bye")>=0){
  goodbye();
  }else if(containsDisco){
  discoParty();
}else if(msg.indexOf("again")>=0){
  tj.stopListening();
  main();
}

  });

}
});
}
// let's have a disco party!

function discoParty() {
    for (i = 0; i < 30; i++) {
        setTimeout(function() {
            var randIdx = Math.floor(Math.random() * tjColors.length);
            var randColor = tjColors[randIdx];
            tj.shine(randColor);
        }, i * 250);
    }
}




function goodbye(){
  tj.wave();
  tj.pulse("red", 1.5);
  process.exit();
}





function morse(){

  tj.stopListening();
  tj.speak("Say something like matrix, self, pills. Dots will be purple, dashes will be orange and spaces between letters will be blue");
  tj.listen(function(msg){
 tj.converse(WORKSPACEID, msg, function(response){

 var message =  response.description.toUpperCase();
 tj.pauseListening();
 console.log(message);
 var split_msg = message.split(""); // "Hello" -> split_msg = [H, E, L, L, O ]
 var code = "";
 var length = parseInt(split_msg.length);
 console.log(split_msg.length);
 console.log(typeof(split_msg.length));
 for(i = 0; i<length; i++){
     console.log("IN");
     console.log(split_msg[i]);
   if((morse[split_msg[i]])){ // morse[""]
     code = morse[split_msg[i]];
     console.log("The type of code is " + typeof(code));
     console.log("The morse code for " + split_msg[i]+ " is " + code);
 //    var msg_code  = code.split(''); // code = ".-"

     for( j = 0; j<code.length; j++){ // msgcode = [. , -]

       var item = code.charAt(j);
       console.log("The type of item is " + item);
       if(item == '.'){
         tj.shine("purple");
         console.log("DOT");

         tj.lowerArm();
         tj.sleep(dot_duration-200);
         tj.raiseArm();
         tj.shine("off");
         tj.sleep(400);
       }else if(item == '-'){
            tj.shine("orange");
         console.log("DASH");
         tj.lowerArm();
         tj.sleep(dot_duration*3);
         tj.raiseArm();
          tj.shine("off");
         tj.sleep(400);
       }

 }
 console.log("Sleeping");
 tj.shine("blue");
 tj.sleep(600);

 }
 }
if(msg.indexOf("start")>=0){
  tj.stopListening();
  main();
}else if(msg.indexOf("close")>=0){
  goodbye();
}
 });


if(msg.indexOf("close")>=0) goodbye();
});
}


function discoParty() {
    for (i = 0; i < 30; i++) {
        setTimeout(function() {
            var randIdx = Math.floor(Math.random() * tjColors.length);
            var randColor = tjColors[randIdx];
            tj.shine(randColor);
        }, i * 250);
    }
}


function feel(){
  tj.speak("Open your heart to me buddy, what's in that mind of yours");
  tj.stopListening();
  tj.listen(function(msg){
    console.log("Feel");
    tj.analyzeTone(msg).then(function(response){
      console.log(response.document_tone.tone_categories[0]);
      console.log(typeof(response.document_tone.tone_categories[0].tones[4].tone_id));

      var max = 0;
      var score = 0;
      var pos = 0;
      response.document_tone.tone_categories[0].tones.forEach(function(element){
        if(response.document_tone.tone_categories[0].tones[pos].score > score){
          max = pos;
          score = response.document_tone.tone_categories[0].tones[pos].score;
        }
        pos++;

      });
      if(response.document_tone.tone_categories[0].tones[max].tone_id == 'sadness'){
        blue();
      }
      if(response.document_tone.tone_categories[0].tones[max].tone_id == 'joy' ||response.document_tone.tone_categories[0].tones[max].tone_id == 'happiness'){
        orange();
      }
if(response.document_tone.tone_categories[0].tones[max].tone_id == 'anger' ||response.document_tone.tone_categories[0].tones[max].tone_id == 'disgust'){
        red();
      }
    //else   if(response.document_tone.tone_categories[0].tones[4] == "joy") chill();
      else if(msg.indexOf("start")>=0){
        tj.stopListening();
        main();
      }else if(msg.indexOf("close")>=0){
        goodbye();
      }
    });
  });
}


function eye(){
  tj.stopListening();
  tj.speak("Say picture to take a photo, it will take 4 beeps");
  tj.listen(function(msg){

      if(msg.indexOf("picture")>=0){
        for(i = 0; i<4; i++){
          tj.shine("red");
          tj.sleep(500);
          tj.shine("off");
          tj.sleep(500);
        }
        tj.shine("white");
        tj.takePhoto("face.jpg").then(function(filePath){
          tj.shine("off");
          tj.speak("Tell me to see");
          tj.stopListening();
          tj.listen(function(msg){
          if(msg.indexOf("see")>=0){
            tj.see(filePath).then(function(output){
              tj.speak("I am looking at " + output[0].class);
              console.log(output);
            })
          }else if(msg.indexOf("close")>=0){
            process.exit();
          }else if(msg.indexOf("start")>=0){
            tj.stopListening();
            console.log("Yeah");
            main();


          }

        });

        });
      }else if(msg.indexOf("close")>=0){
        //go to normal flow
        process.exit();
      }else if(msg.indexOf("start")>=0){
        console.log("Yeah");
        main();


      }

  });
}

function chill(){
var counter = 0;
  tj.play('music/blue.wav');
  while(counter != 10){
  setInterval(chillLights, 200);
  counter++;
}

}

function chillLights(){
  for(i = 0; i<30;i++){
    var randIdx = Math.floor(Math.random() *tjColors.length);
        var randColor = tjColors[randIdx];
    tj.pulse(randColor, 1.5);
  }
}

function partylights(){
tj.wave();
for(i =0; i<30; i++){
var randIdx = Math.floor(Math.random() *tjColors.length);
    var randColor = tjColors[randIdx];
    tj.shine(randColor);
}
}

function blue(){

 while(tj.play('music/bad_day.wav')){
  tj.pulse('blue', 1.5);
  }
}

function orange(){

  while(tj.play('music/i_feel_goo.wav')){
    var randIdx = Math.floor(Math.random() *tjColors.length);
    var randColor = tjColors[randIdx];
    tj.pulse('orange', 1.5);
  }
}


function red(){

  while(tj.play('music/back_in_black.wav')){
    tj.pulse('red', 1.5);
  }
}

function dance(){

tj.play('music/stayin.wav')


setInterval(partylights, 200);

//if(tj.play('music/stayin.wav') == false) clearInterval(intervalo);





}
