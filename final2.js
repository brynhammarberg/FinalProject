
let poseNet;
let poses = [];

let video;
var videoIsPlaying; 


var song3
var analyzer;
var bg;


let font,
fontsize = 20;

let counter = 0;


// array of color palette
var colors = [[242,227, 210], [167, 13, 53], [134, 46, 166], [139, 104, 68], [217, 37, 102], [67, 20, 18]
                , [144, 46, 128], [106, 27, 32], [193, 151, 95]];



function preload(){
    song3 = loadSound('music/looks.mp3');
    

}


function setup() {
  videoIsPlaying = false; 
  createCanvas(windowWidth, windowHeight);

  background(colors[0][0],colors[0][1],colors[0][2]);

  video = createCapture(VIDEO);
  // video = createVideo('dancing.mp4', vidLoad);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, {multiplier:0.5}, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();


  analyzer = new p5.Amplitude();

  strokeWeight(3);

  
  // textSize(fontsize);

  rectMode(CENTER);
  ellipseMode(CENTER);

  frameRate(18.8);
}

function modelReady() {
  select('#status').html('Model Loaded');
}

var count = 1;

function mousePressed() {


    // background(colors[0][0],colors[0][1],colors[0][2]);

    if (count%2 == 0){
        song3.stop();
        count = 1;
    }

    else if (count%1 == 0){
        song3.stop();
        song3.play();
        analyzer.setInput(song3);
        count += 1;
        

    }  

    
    vidLoad();
}



var volumeControl = 0;
var ampControl = 10;

var hold = 'false';


function draw() {
    //comment out the two image(video, 0, 0, width, height) to not show video element
  //   image(video, 0, 0, width, height);
    translate(width,0); // move to far corner
    scale(-1.0,1.0);    // flip x-axis backwards
  //   image(video, 0, 0, width, height);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  // drawSkeleton();
//   drawMiddle();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
      var Xpos = 0;
      var maxY = 100000;
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        //draw the red ellipses

      	// noStroke();
        // fill(255, 0, 0);
        // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        if (keypoint.position.y < maxY-20){
            maxY = keypoint.position.y;
            Xpos = keypoint.position.x;
          }
      }
    }
  }
    // Set the volume to 0.4
    var volume = 0.4;
    song3.amp(volume);

    // Get the average (root mean square) amplitude
    var rms = analyzer.getLevel();

    if (rms == 0){
        background(colors[0][0],colors[0][1],colors[0][2])
        fill(colors[1][0],colors[1][1],colors[1][2])
    }

    if (rms > .18){
        stroke(0)
        // let numb = random(0,4);
        let random = (int)(Math.random() * colors.length);
        fill(colors[random][0], colors[random][1], colors[random][2]);
        ellipse(Xpos, maxY, 3000, 3000);
    }
    if (rms > (.15)){
        stroke(0)
        // let numb = random(0,4);
        let random = (int)(Math.random() * 9);
        fill(colors[random][0], colors[random][1], colors[random][2]);
    } else{
        stroke(0);
        fill(colors[1][0],colors[1][1],colors[1][2]);
    }


    //drawing the actual shape that changes with movement, amplitude, volume, and pan
        
    ellipse(Xpos, maxY, Math.abs(Math.abs((Xpos-630)/7)-90) + rms*random(500,2000) 
        + Math.abs(Math.abs((maxY-325)/5)-65), (Math.abs(Math.abs((Xpos-630)/7)-90) + 
        rms*random(1500,2000) + Math.abs(Math.abs((maxY-325)/5)-65)));

}