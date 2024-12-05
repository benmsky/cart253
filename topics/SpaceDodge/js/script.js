let spaceship;
let asteroids = [];
let powerUps = [];
let score = 0;
let starfield = [];
let hyperspaceStars = [];
let gameOver = false;
let level = 1;
let speedBoostActive = false;
let shieldActive = false;
let shieldTimer = 0;
let speedBoostTimer = 0;
let showIntro = true;
let introTimer = 300;

// Time interval between asteroid spawns
let asteroidSpawnRate = 30; 
// Normal game speed
let gameSpeed = 1; 
let invincible = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  spaceship = new Spaceship();

  // Creates a starfield for background (stars in hyperspace)
  for (let i = 0; i < 500; i++) {
    starfield.push({ x: random(width), y: random(height), speed: random(1, 3), size: random(1, 2) });
  }

  // Create distant stars for hyperspace effect
  for (let i = 0; i < 200; i++) {
    hyperspaceStars.push({ x: random(width), y: random(height), speed: random(5, 10), size: random(0.5, 1.5) });
  }
}

function draw() {
  background(0);

  if (showIntro) {
    displayIntro();
    return;
  }

  if (gameOver) {
    displayGameOver();
    return;
  }

  // Hyperspace effect: stars moving toward the screen
  for (let star of hyperspaceStars) {
    fill(255, 255, 255, 200);
    noStroke();
    ellipse(star.x, star.y, star.size);
    // Speed up when boost is active
    star.y += star.speed * (speedBoostActive ? 10 : 1); 

    // Reset stars when they pass the bottom
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
  }

  // Draw and move the main starfield for the background
  for (let star of starfield) {
    fill(255, 255, 255, 80);
    noStroke();
    ellipse(star.x, star.y, star.size);
    // Speed up when boost is active
    star.y += star.speed * (speedBoostActive ? 10 : 1); 

    // Loop stars back to the top when they move out of the screen
    if (star.y > height) {
      star.y = 0;
      star.x = random(width);
    }
  }

  // Display and move the spaceship
  spaceship.show();
  spaceship.move();

  // Spawn asteroids more frequently with increasing speed per level
  if (frameCount % (asteroidSpawnRate / (speedBoostActive ? 10 : 1)) === 0) { // Speed up asteroid spawn rate during boost
    let size = random(30, 60);
    asteroids.push(new Asteroid(random(width), -size, size));
  }

  // Spawn power-ups randomly
  if (frameCount % 200 === 0) {
    powerUps.push(new PowerUp(random(width), -30));
  }

  // Display and move asteroids
  for (let asteroid of asteroids) {
    asteroid.show();
    asteroid.move();
  }

  // Display and move power-ups
  for (let powerUp of powerUps) {
    powerUp.show();
    powerUp.move();
    if (spaceship.hits(powerUp)) {
      powerUp.activate(spaceship);
      powerUps = powerUps.filter(p => p !== powerUp); // Remove power-up after activation
    }
  }

  // Check for collisions, only if not invincible or shield is active
for (let asteroid of asteroids) {
  if (spaceship.hits(asteroid) && !(invincible || shieldActive)) {
    gameOver = true;
  }
}


  // Remove off-screen asteroids
  asteroids = asteroids.filter(asteroid => asteroid.y < height + asteroid.size);

  // Display score and level at top-center
  fill(255);
  textSize(24);
  textAlign(CENTER, TOP);
  text(`Score: ${score}   Level: ${level}`, width / 2, 20);
  score += (speedBoostActive ? 10 : 1); // Increase score faster when in fast-forward

  // Increase level and difficulty every 1000 points
  if (score >= level * 1000) {
    level++;
    asteroidSpawnRate = max(10, asteroidSpawnRate - 3); // Increase asteroid spawn rate and decrease interval
    asteroids.forEach(asteroid => asteroid.increaseSpeed()); // Increase speed of all asteroids
    // Increase the number of asteroids per spawn at higher levels
    for (let i = 0; i < level / 2; i++) {
      asteroids.push(new Asteroid(random(width), -random(30, 60), random(30, 60)));
    }
  }

  // Handle active power-up timers
  if (shieldActive) {
    shieldTimer--;
    if (shieldTimer <= 0) {
      shieldActive = false;
    }
  }

  if (speedBoostActive) {
    speedBoostTimer--;
    if (speedBoostTimer <= 0) {
      speedBoostActive = false;
      gameSpeed = 1; // Reset game speed after boost
      invincible = false; // End invincibility after speed boost
    }
  }

  // Visual feedback for speed boost
  if (speedBoostActive) {
    fill(255, 255, 0);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Speed Boost!", width / 2, height / 4);
  }
}

function displayIntro() {
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Welcome to Space Dodge!", width / 2, height / 3);
  textSize(20);
  text("Use W, A, S, D to move.", width / 2, height / 2);
  text("Avoid asteroids and collect power-ups!", width / 2, height / 2 + 40);
  text("Power-ups: Speed (Yellow) and Shield (Green)", width / 2, height / 2 + 80);
  text("Press 'Enter' to start", width / 2, height / 2 + 120);

  introTimer--;
  if (introTimer <= 0) {
    showIntro = false;
  }

  if (keyIsPressed && keyCode === ENTER) {
    showIntro = false;
  }
}

function displayGameOver() {
  fill(255, 0, 0);
  textSize(64);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2);
  textSize(32);
  text(`Final Score: ${score}`, width / 2, height / 2 + 50);
  textSize(20);
  text(`Press F5 to restart`, width / 2, height / 2 + 100);
}

function keyPressed() {
  if (key === 'A' || key === 'a') {
    spaceship.setDir(-1, spaceship.ydir);
  } else if (key === 'D' || key === 'd') {
    spaceship.setDir(1, spaceship.ydir);
  } else if (key === 'W' || key === 'w') {
    spaceship.setDir(spaceship.xdir, -1);
  } else if (key === 'S' || key === 's') {
    spaceship.setDir(spaceship.xdir, 1);
  }
}

function keyReleased() {
  if (['A', 'a', 'D', 'd'].includes(key)) {
    spaceship.setDir(0, spaceship.ydir);
  } else if (['W', 'w', 'S', 's'].includes(key)) {
    spaceship.setDir(spaceship.xdir, 0);
  }
}

// Spaceship class
class Spaceship {
  constructor() {
    this.x = width / 2;
    this.y = height - 50;
    this.xdir = 0;
    this.ydir = 0;
    this.width = 30;
    this.height = 30;
  }

  show() {
    fill(0, 150, 255);
    noStroke();
    // Glowing spaceship with some glow effect
    for (let i = 0; i < 10; i++) {
      fill(0, 150, 255, 255 - i * 25);
      triangle(this.x - this.width / 2, this.y, this.x + this.width / 2, this.y, this.x, this.y - this.height + i * 2);
    }

    // Shield effect: Draw a glowing shield around the spaceship if active
    if (shieldActive) {
      fill(0, 255, 0, 100);
      ellipse(this.x, this.y, this.width * 1.5, this.height * 1.5);
    }

    // Speed boost trail: Draw a trail behind spaceship if speed boost is active
    if (speedBoostActive) {
      fill(255, 255, 0, 150);
      ellipse(this.x - 10, this.y + this.height / 2, 20, 10);
    }
  }

  move() {
    this.x += this.xdir * 5 * gameSpeed;
    this.y += this.ydir * 5 * gameSpeed;

    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  setDir(x, y) {
    this.xdir = x;
    this.ydir = y;
  }

  hits(other) {
    let distance = dist(this.x, this.y, other.x, other.y);
    return distance < this.width / 2 + other.size / 2;
  }
}

// Asteroid class
class Asteroid {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(2, 4);
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  move() {
    this.y += this.speed;
  }

  increaseSpeed() {
    this.speed += 0.5;
  }
}

// PowerUp class
class PowerUp {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 30;
    this.type = random() < 0.5 ? "speed" : "shield";
  }

  show() {
    if (this.type === "speed") {
      fill(255, 255, 0);
    } else {
      fill(0, 255, 0);
    }
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  move() {
    this.y += 3;
  }

  activate(spaceship) {
    if (this.type === "speed") {
      speedBoostActive = true;
      speedBoostTimer = 100;
      gameSpeed = 2;
      invincible = true; // Temporary invincibility
    } else if (this.type === "shield") {
      shieldActive = true;
      shieldTimer = 500;
    }
  }
}
