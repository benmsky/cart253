/**
 * Attack On Turrets
 * Benjamin Macknofsky
 * 
 * A game where the player controls a UFO, attempting to destroy as 
 * many turrets as possible.
 * 
 * Controls: 
 * - mouse to move the ufo
 * - spacebar to shoot lasers below 
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 */

let score = 0;
// Number of lives
let lives = 3; 
let starField = [];
let ufo;
let turrets = [];
let laserBeams = [];
let particles = [];
let isGameOver = false;
let gameStarted = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Star field for the background
  for (let i = 0; i < 200; i++) {
    starField.push(createVector(random(width), random(height)));
  }

  // UFO object
  ufo = new UFO();

  // Creates initial turrets at random positions
  for (let i = 0; i < 15; i++) {
    turrets.push(new Turret(random(width), height - 50));
  }
}

function draw() {
  background(0);
  
  // Starry background effect, changes colours to reflect a war in the distance
  fill(255, 255, 255, 150);
  for (let star of starField) {
    star.y += map(star.x, 0, width, 0.5, 2);
    if (star.y > height) star.y = 0;
    ellipse(star.x, star.y, random(1, 3));
  }

  // Display intro screen if the game hasn't started
  if (!gameStarted) {
    displayIntroScreen();
    return;
  }

  // Check if game is over
  if (isGameOver) {
    displayEndScreen();
    return;
  }

  // Update and show UFO
  ufo.update();
  ufo.show();

  // Update and show turrets
  for (let i = turrets.length - 1; i >= 0; i--) {
    turrets[i].update();
    turrets[i].show();

    for (let j = laserBeams.length - 1; j >= 0; j--) {
      if (
        dist(laserBeams[j].x, laserBeams[j].y, turrets[i].x, turrets[i].y) < 
          turrets[i].width / 2 &&
        laserBeams[j].source !== "turret"
      ) {
        let turretX = turrets[i].x;
        let turretY = turrets[i].y;

        turrets.splice(i, 1);
        laserBeams.splice(j, 1);
        score++;
        createExplosion(turretX, turretY);

        // Respawn new turret at a random position
        let newTurret = new Turret(random(width), height - 50);
        turrets.push(newTurret);

        break;
      }
    }
  }

  // If all turrets are destroyed, end the game (unlikely)
  if (turrets.length === 0) {
    isGameOver = true;
  }

  // Update and show laser beams
  for (let i = laserBeams.length - 1; i >= 0; i--) {
    laserBeams[i].update();
    laserBeams[i].show();    

    // Check if laser hits UFO
    if (
      dist(laserBeams[i].x, laserBeams[i].y, ufo.x, ufo.y) < ufo.width / 2 &&
      laserBeams[i].source !== "ufo"
    ) {
      laserBeams.splice(i, 1);
      if (!ufo.isHit) {
        ufo.isHit = true;
        // Decrease lives when hit
        lives--; 
        // Temporary invulnerability
        setTimeout(() => (ufo.isHit = false), 200); 
        if (lives <= 0) {
          isGameOver = true;
        }
      }
    }

    // Remove laser beam if off-screen
    if (laserBeams[i].offScreen()) {
      laserBeams.splice(i, 1);
    }
  }

  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  // Display score and lives
  displayHUD();
}

function keyPressed() {
  if (key === ' ' && !isGameOver && gameStarted) {
    ufo.shoot();
  }
}

function mousePressed() {
  if (!gameStarted) {
    gameStarted = true;
  }

  if (isGameOver) {
    let retryButtonX = width / 2 - 100;
    let retryButtonY = height / 2 + 50;
    let retryButtonWidth = 200;
    let retryButtonHeight = 50;

    if (mouseX > retryButtonX && mouseX < retryButtonX + retryButtonWidth &&
        mouseY > retryButtonY && mouseY < retryButtonY + retryButtonHeight) {
      resetGame();
    }
  }
}

function displayIntroScreen() {
  fill(255, 255, 255, 150);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("Attack On Turrets!", width / 2, height / 3);
  textSize(24);
  text("Use mouse to move UFO. Press space to shoot lasers.", width / 2, height / 2);
  text("Click to start", width / 2, height / 1.5);
}

function displayHUD() {
  fill(255, 255, 0);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);

  fill(255, 0, 0);
  textAlign(RIGHT, TOP);
  text("Lives: " + lives, width - 20, 20);
}

function displayEndScreen() {
  fill(255, 0, 0, 200);
  textSize(48);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2 - 50);
  textSize(32);
  text("Score: " + score, width / 2, height / 2);

  fill(255, 255, 255, 200);
  // Retry button
  rect(width / 2 - 100, height / 2 + 50, 200, 50, 10); 
  fill(0);
  textSize(24);
  text("Retry", width / 2, height / 2 + 75);
}

function resetGame() {
  score = 0;
  lives = 3;
  turrets = [];
  laserBeams = [];
  particles = [];
  isGameOver = false;
  gameStarted = false;

  ufo = new UFO();

  // Create initial turrets at random positions
  for (let i = 0; i < 5; i++) {
    turrets.push(new Turret(random(width), height - 50));
  }
}

class UFO {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.width = 120;
    this.height = 60;
    this.speed = 8;
    this.isHit = false;
  }

  update() {
    this.x = mouseX - this.width / 2;
    this.y = mouseY - this.height / 2;
  }

  show() {
    noStroke();

    // UFO body (main elliptical body)
    // Body color
    fill(100, 100, 255); 
    ellipse(this.x + this.width / 2, this.y + this.height / 2, this.width, this.height);

    // UFO cockpit (smaller ellipse on top)
    // Lighter color for the cockpit
    fill(200, 200, 255); 
    ellipse(this.x + this.width / 2, this.y + this.height / 2 - 10, this.width * 0.6, this.height * 0.4);

    // UFO engines (glowing effects at the back)
    // Red glow
    fill(255, 0, 0, 150); 
    ellipse(this.x + this.width / 4, this.y + this.height / 2 + 10, 30, 15);
    ellipse(this.x + 3 * this.width / 4, this.y + this.height / 2 + 10, 30, 15);
  }

  shoot() {
    laserBeams.push(new LaserBeam(this.x + this.width / 2, this.y + this.height / 2, 'ufo'));
  }
}


class LaserBeam {
  constructor(x, y, source) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.source = source;
    // Store previous positions for the trail
    this.positions = []; 

    if (source === 'turret') {
      this.angle = atan2(mouseY - y, mouseX - x);
      this.speedX = cos(this.angle) * this.speed;
      this.speedY = sin(this.angle) * this.speed;
    } else {
      this.speedX = 0;
      this.speedY = this.speed;
    }
  }

  update() {
    // Store position for trail effect
    this.positions.push(createVector(this.x, this.y));
    if (this.positions.length > 20) {
      this.positions.shift();
    }

    this.x += this.speedX;
    this.y += this.speedY;
  }

  show() {
    // Draw the trail with fading effect
    // Thicker trail for better visibility
    strokeWeight(4); 
    for (let i = 0; i < this.positions.length; i++) {
      let alpha = map(i, 0, this.positions.length, 0, 255);
      stroke(
        // Red for turret lasers
        this.source === "ufo" ? 0 : 255, 
        // Cyan for UFO lasers
        this.source === "ufo" ? 255 : 0, 
        // No green for turret lasers
        this.source === "ufo" ? 255 : 0, 
        alpha
      );
      point(this.positions[i].x, this.positions[i].y);
    }

    // Draw the main laser
    // Thicker main laser
    strokeWeight(6); 
    stroke(
      // Red for turret lasers
      this.source === "ufo" ? 0 : 255, 
      // Cyan for UFO lasers
      this.source === "ufo" ? 255 : 0, 
      // No green for turret lasers
      this.source === "ufo" ? 255 : 0 
    );
    line(this.x, this.y, this.x - this.speedX * 2, this.y - this.speedY * 2);
  }

  offScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}


class Turret {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 60;
    this.height = 20;
    this.isDestroyed = false;
    this.shooting = false;
    this.angle = 0;
    // Random speed for horizontal movement
    this.speedX = random(-2, 2); 
  }

  update() {
    if (!this.isDestroyed) {
      // Move the turret left or right freely
      this.x += this.speedX;

      // Reverse direction if it hits the edges
      if (this.x < 0 || this.x > width) {
        this.speedX = -this.speedX;
      }

      this.angle = atan2(mouseY - this.y, mouseX - this.x);
      if (frameCount % 60 === 0) {
        this.shooting = true;
        laserBeams.push(new LaserBeam(this.x, this.y, "turret"));
      }
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);

    // Turret body (rectangular)
    fill(150, 150, 255);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.width, this.height);

    // Turret cannon (circular end)
    fill(200, 200, 255);
    ellipse(0, this.height / 2, this.width / 2, this.width / 2);
    pop();
  }
}

function createExplosion(x, y) {
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(x, y));
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alpha = 255;
    this.size = random(5, 10);
    this.speed = createVector(random(-2, 2), random(-2, 2));
  }

  update() {
    this.x += this.speed.x;
    this.y += this.speed.y;
    this.alpha -= 5;
  }

  show() {
    noStroke();
    fill(255, this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
