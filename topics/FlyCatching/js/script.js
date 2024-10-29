/**
 * Fly Catching
 * Benjamin Macknofsky
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Frog
const frog = {
    body: {
        x: 320,
        y: 400,
        size: 100
    },
    // The frog'sposition, size, speed, and state
    tongue: {
        x: undefined,
        y: 380,
        size: 20,
        speed: 20,
        state: "idle"
    }
};

// Firefly
const firefly = {
    x: 0,
    y: 200,
    size: 10,
    speed: 3,
    angle: 0,
    isCaught: false
};

// Score variable to track how many fireflies have been caught
let score = 0;

/**
 * Creates the canvas and initializes the firefly
 */
function setup() {
    createCanvas(640, 480);
    resetFirefly();
}

function draw() {
    background("#191970");
    moveFirefly();
    drawFirefly();
    moveFrogAndLilyPad();
    moveTongue();
    drawFrogAndLilyPad();
    checkTongueFireflyOverlap();
    displayScore();
}

/**
 * Moves the firefly according to its speed and adds a wobble effect
 * Resets the firefly if it gets all the way to the right
 */
function moveFirefly() {
    if (!firefly.isCaught) {
        firefly.x += firefly.speed;
        firefly.y += sin(firefly.angle) * 2;
        firefly.angle += 0.05;

        if (firefly.x > width) {
            resetFirefly();
        }
    }
}

/**
 * Draws the firefly as a glowing yellow-green circle with a soft glow
 */
function drawFirefly() {
    if (firefly.isCaught) {
        // Move firefly with the tongue
        firefly.x = frog.tongue.x;
        firefly.y = frog.tongue.y;
    }

    push();
    noStroke();
    fill(173, 255, 47, 100);
    ellipse(firefly.x, firefly.y, firefly.size * 3);
    fill("#ADFF2F");
    ellipse(firefly.x, firefly.y, firefly.size);
    pop();
}

/**
 * Resets the firefly to the left with a random y and resets its wobble angle
 */
function resetFirefly() {
    firefly.x = 0;
    firefly.y = random(50, 300);
    firefly.angle = random(0, TWO_PI);
    firefly.isCaught = false;
}

/**
 * Moves the frog and the lily pad to the mouse position on x
 */
function moveFrogAndLilyPad() {
    frog.body.x = mouseX;
    frog.tongue.x = frog.body.x;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    frog.tongue.x = frog.body.x;
    if (frog.tongue.state === "idle") {
        frog.tongue.y = frog.body.y;
    }
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= frog.body.y) {
            frog.tongue.state = "idle";
            if (firefly.isCaught) {
                resetFirefly();
            }
        }
    }
}

/**
 * Draws the frog sitting on a lily pad with eyes and legs
 */
function drawFrogAndLilyPad() {
    // Draws the lily pad
    push();
    fill("#228B22");
    noStroke();
    ellipse(frog.body.x, frog.body.y + 50, 150, 40);
    pop();

    // Draws the frog's legs
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x - 35, frog.body.y + 40, 30, 15);
    ellipse(frog.body.x + 35, frog.body.y + 40, 30, 15);
    pop();

    // Draws the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Draws the frog's eyes
    push();
    fill("#ffffff");
    ellipse(frog.body.x - 20, frog.body.y - 30, 20, 20);
    ellipse(frog.body.x + 20, frog.body.y - 30, 20, 20);
    fill("#000000");
    ellipse(frog.body.x - 20, frog.body.y - 30, 10, 10);
    ellipse(frog.body.x + 20, frog.body.y - 30, 10, 10);
    pop();

    // Draws the frog's tongue
    if (frog.tongue.state !== "idle") {
        push();
        fill("#ff0000");
        noStroke();
        ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
        pop();

        push();
        stroke("#ff0000");
        strokeWeight(frog.tongue.size);
        line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
        pop();
    }
}

/**
 * Handles the tongue overlapping the firefly
 */
function checkTongueFireflyOverlap() {
    const d = dist(frog.tongue.x, frog.tongue.y, firefly.x, firefly.y);
    const eaten = (d < frog.tongue.size / 2 + firefly.size / 2);
    if (eaten && !firefly.isCaught) {
        firefly.isCaught = true;
        frog.tongue.state = "inbound";
        score++;
    }
}

/**
 * Launch the tongue on click 
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

/**
 * creates the score counter
 */
function displayScore() {
    push();
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 10, 10);
    pop();
}