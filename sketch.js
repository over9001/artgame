var r, g, b;
var clouds = [];
var mic, fft;
var osc;
var awesometext;

function setup() {

  H = (function getDocHeight() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    );
  })();

  W = window.screen.availWidth;

  createCanvas(W,H);

  background(200);

  var runtimeclouds = 10;
  //create 100 clouds
  for (var i = 0; i < runtimeclouds; i++){
    clouds[i] = new DreamCloud(random(width),random(height), random(100));
  }

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);

  //noisy = new p5.Noise()
  //noisy.start();

  osc = new p5.Oscillator();
  osc.start();

  awesometext = new Complimentor(width/2,height/2,20);
  
}


function draw() {

  //I run these clouds
  for (var i = 0; i < clouds.length; i++){
    clouds[i].run();
  }
  //Choose a cloud to sing
  chosencloud = clouds[parseInt(random(clouds.length))];
  if (random(100)<20){
    chosencloud.sing();
  }
  else
  {
   clouds.push(new DreamCloud(random(width),random(height), random(100)));
  }
  

  var spectrum = fft.analyze();

   stroke(0);
   
   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(i, map(spectrum[i], 0, 255, height, 0) );
   }
   endShape();

   stroke(255);

   beginShape();
   for (i = 0; i<spectrum.length; i++) {
    vertex(width - i, map(spectrum[i], 0, 255, 0, height) );
   }
   endShape();

awesometext.move();
awesometext.render();



}

// When the user clicks the mouse
function mousePressed() {
  // Check if mouse is inside any circles
  osc.stop()

  clouds.push(new DreamCloud(random(width),random(height), random(100)));
 
}

function DreamCloud(x, y, cloudSize) {
  
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);

  this.r = random(255);
  this.g = random(255);
  this.b = random(255);
  this.cloudsize = cloudSize;

  if (clouds.length > 200){
    clouds.splice(0,1);
  }
}

DreamCloud.prototype.run = function() {
  this.morph();
  //this.sing();
  this.migrate();
  this.render();
}

DreamCloud.prototype.morph = function() {
  this.r = this.r + random(-5, 5);
  this.g = this.g + random(-5, 5);
  this.b = this.b + random(-5, 5);
  this.cloudsize = this.cloudsize + random(-1, 1);
  this.position.x = this.position.x + random(-5, 5);
  this.position.y = this.position.y + random(-5, 5);
}

DreamCloud.prototype.migrate = function() {
 this.position.add(this.velocity);
}


DreamCloud.prototype.sing = function() {
  osc.freq(1+parseInt(abs(this.r*this.g))/40);
}

DreamCloud.prototype.render = function() {
  fill(this.r, this.g, this.b);
  stroke(200);
  ellipse(this.position.x, this.position.y, this.cloudsize, this.cloudsize);
}

function Complimentor(x,y,complimentSize){
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.compliment = ["You're awesome!"]//"You're the best!","Don't give up!","Keep up the good work!","Believe in yourself!","Trust no one.","Love Love Love","There has never been a better time than now!","GO! GO! GO!"];
  textSize(complimentSize);
  text(this.compliment[0],x,y);
}

Complimentor.prototype.render = function() {
  text(this.compliment,this.position.x,this.position.y);
}

Complimentor.prototype.move = function() {
  this.position.add(this.velocity);

}
