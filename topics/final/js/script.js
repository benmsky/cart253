let turret;
let bullets = [];
let fallingObjects = [];
let bulletSpeed = 12;
let objectSpeed = 2;
let explosions = [];
let fullAutoMode = false;
let score = 0;
let lastShotTime = 0; // Cooldown timer
let shotCooldown = 100; // Time in milliseconds between shots (adjust as needed)
let maxBullets = 10; // Maximum number of bullets on screen at once
let powerUps = [];
let tripleShot = false;
let powerUpTimer = 0;
let starField = [];

// Particle system variables
let particles = [];
let gravity = 0.05;

// New background effects
let nebulaEffect;
let showIntro = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  turret = new Turret();
  
  // Create a star field for the background
  for (let i = 0; i < 200; i++) {
    starField.push(createVector(random(width), random(height)));
  }

  // Add nebula effect
  nebulaEffect = new NebulaEffect();
}

function draw() {
  background(0);
  
  // Nebula background effect
  nebulaEffect.update();
  nebulaEffect.show();

  // Starry background effect
  fill(255, 255, 255, 150);
  for (let star of starField) {
    ellipse(star.x, star.y, random(1, 3));
  }

  // Show intro text
  if (showIntro) {
    showIntroduction();
    return;
  }

  // Power-Up timer
  if (powerUpTimer > 0) {
    powerUpTimer--;
  }

  // Update and show the turret
  turret.update();
  turret.show();

  // Update and show bullets with trails
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].show();
    if (bullets[i].offScreen()) {
      bullets.splice(i, 1);
    }
  }

  // Update and show falling objects with effects
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    fallingObjects[i].update();
    fallingObjects[i].show();
    if (fallingObjects[i].offScreen()) {
      fallingObjects.splice(i, 1);
    }
  }

  // Spawn new falling objects
  if (frameCount % 20 === 0) {
    fallingObjects.push(new FallingObject());
  }

  // Check for collisions between bullets and falling objects
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (fallingObjects[i].hits(bullets[j])) {
        explosions.push(new Explosion(fallingObjects[i].x, fallingObjects[i].y));
        fallingObjects.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        break;
      }
    }
  }

  // Update and show explosions with particles
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].show();
    if (explosions[i].isFinished()) {
      explosions.splice(i, 1);
    }
  }

  // Handle automatic firing when spacebar is pressed (full-auto mode)
  if (fullAutoMode && mouseIsPressed) {
    let currentTime = millis();
    if (currentTime - lastShotTime > shotCooldown && bullets.length < maxBullets) {
      if (tripleShot) {
        bullets.push(new Bullet(turret.x + turret.width / 2 - 10, height - turret.height, turret.angle - 0.1));
        bullets.push(new Bullet(turret.x + turret.width / 2, height - turret.height, turret.angle));
        bullets.push(new Bullet(turret.x + turret.width / 2 + 10, height - turret.height, turret.angle + 0.1));
      } else {
        bullets.push(new Bullet(turret.x + turret.width / 2, height - turret.height, turret.angle));
      }
      lastShotTime = currentTime; // Reset the shot timer
    }
  }

  // Power-Up Spawn Logic
  if (frameCount % 120 === 0) {
    powerUps.push(new PowerUp());
  }

  // Update and show power-ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].update();
    powerUps[i].show();

    if (turret.hits(powerUps[i])) {
      applyPowerUp(powerUps[i]);
      powerUps.splice(i, 1);
    }
  }

  // Update and show particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].show();
    if (particles[i].isFinished()) {
      particles.splice(i, 1);
    }
  }

  displayScore();
}

function showIntroduction() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Welcome to the game! Here are the mechanics:\n\n1. Move the turret with your mouse.\n2. Click to shoot bullets.\n3. Press the spacebar for full-auto mode.\n4. Collect power-ups to upgrade your weapons.\n\nPress any key to start.", width / 2, height / 2);
}

function keyPressed() {
  if (key === ' ') {
    fullAutoMode = !fullAutoMode;
  }

  if (showIntro) {
    showIntro = false; // Hide intro when a key is pressed
  }
}

function mousePressed() {
  if (!fullAutoMode && bullets.length < maxBullets) {
    if (tripleShot) {
      bullets.push(new Bullet(turret.x + turret.width / 2 - 10, height - turret.height, turret.angle - 0.1));
      bullets.push(new Bullet(turret.x + turret.width / 2, height - turret.height, turret.angle));
      bullets.push(new Bullet(turret.x + turret.width / 2 + 10, height - turret.height, turret.angle + 0.1));
    } else {
      bullets.push(new Bullet(turret.x + turret.width / 2, height - turret.height, turret.angle));
    }
  }
}

function displayScore() {
  fill(255);
  textSize(32);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 20);
}

// Turret class with enhanced visual effects
class Turret {
  constructor() {
    this.x = width / 2 - 30; // Starting x position
    this.y = height - 30;    // Fixed y position at the bottom of the screen
    this.width = 60;
    this.height = 30;
    this.barrelLength = 40;
    this.angle = 0;
    this.speed = 5;  // Speed at which the turret moves left and right
  }

  update() {
    // Move turret with mouse position (or arrow keys)
    if (mouseX > this.x + this.width / 2) {
      this.x += this.speed; // Move right
    } else if (mouseX < this.x + this.width / 2) {
      this.x -= this.speed; // Move left
    }

    // Constrain turret within screen bounds
    this.x = constrain(this.x, 0, width - this.width);
    
    // Update angle of the turret to aim at the mouse
    this.angle = atan2(mouseY - (height - this.height), mouseX - (this.x + this.width / 2));
  }

  show() {
    fill(150, 0, 0); // Dark red for the turret base
    rect(this.x, height - this.height, this.width, this.height);
    push();
    translate(this.x + this.width / 2, height - this.height);
    rotate(this.angle);
    stroke(255, 0, 0); // Red barrel
    strokeWeight(4);
    line(0, 0, this.barrelLength, 0); // Barrel line
    pop();
  }

  hits(powerUp) {
    let d = dist(this.x, height - this.height, powerUp.x, powerUp.y);
    return d < this.width / 2 + powerUp.size / 2;
  }
}

// Bullet class with glowing trails
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 15;
    this.angle = angle;
    this.speed = bulletSpeed;
    this.trail = []; // Store positions for the trail effect
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;

    // Store the current position for the trail
    this.trail.push(createVector(this.x, this.y));

    // Limit the number of points in the trail (to avoid performance issues)
    if (this.trail.length > 10) {
      this.trail.shift();
    }
  }

  show() {
    // Draw the bullet trail with glowing effect
    for (let i = 0; i < this.trail.length; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 255); // Fade effect
      fill(255, 255, 0, alpha); // Yellow glow
      noStroke();
      ellipse(this.trail[i].x, this.trail[i].y, this.width, this.height);
    }

    // Draw the bullet with a glowing effect
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.width, this.height);
  }

  offScreen() {
    return this.y < 0 || this.y > height || this.x < 0 || this.x > width;
  }
}

// Explosion class with advanced particle effects
class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 40;
    this.particles = [];
    for (let i = 0; i < 100; i++) {  // Increased number of particles
      this.particles.push(new Particle(this.x, this.y));
    }
  }

  update() {
    for (let particle of this.particles) {
      particle.update();
    }
  }

  show() {
    for (let particle of this.particles) {
      particle.show();
    }
  }

  isFinished() {
    return this.particles.length === 0;
  }
}

// Particle class with more dramatic effects
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(5, 15); // Random particle size
    this.speed = random(1, 10); // Faster speed
    this.angle = random(TWO_PI);
    this.lifespan = 255;
    this.color = color(random(255), random(255), random(255)); // Random color for variety
  }

  update() {
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.lifespan -= 5;
  }

  show() {
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}

// FallingObject class with more complex behavior
class FallingObject {
    constructor() {
      this.x = random(width);
      this.y = 0;
      this.size = random(20, 60);  // Vary the size of the objects
      this.speed = random(2, 5);  // Vary the falling speed
      this.type = random(["rock", "alien", "satellite"]);  // Different types of objects
      this.angle = 0;
      this.wingFlapSpeed = 0.1;
      this.direction = random([-1, 1]);
    }
  
    update() {
      this.y += this.speed;
      this.x += this.direction * 2;
      this.angle += this.wingFlapSpeed;
      if (this.angle > TWO_PI || this.angle < 0) {
        this.wingFlapSpeed *= -1;
      }
    }

  show() {
    this.drawWingedCreature();
  }

  drawWingedCreature() {
    fill(200, 100, 255); // Light purple for creature
    ellipse(this.x, this.y, this.size);

    // More dynamic wing movement
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(255, 255, 0); // Yellow wings
    ellipse(-this.size / 2, 0, this.size / 2, this.size / 2);
    ellipse(this.size / 2, 0, this.size / 2, this.size / 2);
    pop();
  }

  offScreen() {
    return this.y > height;
  }

  hits(bullet) {
    let d = dist(this.x, this.y, bullet.x, bullet.y);
    return d < this.size / 2 + bullet.width / 2;
  }
}

// PowerUp class with spawn logic
class PowerUp {
    constructor() {
      this.x = random(width);
      this.y = random(height / 2);
      this.size = 25;
      this.type = random(["Triple Shot", "Nuke"]); 
    }
  
    update() {
      this.y += objectSpeed;
    }
  
    show() {
      fill(255, 0, 255); // Pink power-up
      noStroke();
      ellipse(this.x, this.y, this.size);
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(12);
      text(this.type.charAt(0), this.x, this.y); // Show first letter for type
    }
  }  

// Apply Power-Up effects
function applyPowerUp(powerUp) {
    if (powerUp.type === 'Triple Shot' && !tripleShot) {
      tripleShot = true;
      powerUpTimer = 300;
    } else if (powerUp.type === 'Nuke') {
      // Nuke power-up: destroy all falling objects
      fallingObjects = [];
      score += 10; // Bonus score for using Nuke
    }
  }
  

// Nebula Effect class
class NebulaEffect {
  constructor() {
    this.nebulaColor = color(random(255), random(255), random(255));
    this.opacity = random(30, 60);
  }

  update() {
    this.nebulaColor.setAlpha(this.opacity);
  }

  show() {
    fill(this.nebulaColor);
    noStroke();
    ellipse(random(width), random(height), random(50, 150));
  }
}
