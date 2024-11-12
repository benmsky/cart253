/**
 * Fly Catching
 * Benjamin Macknofsky
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Press spacebar to change Night to Day
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict";

// Game state to control title screen, gameplay, and end screen
let gameState = "title";

// Frog
const frog = {
    body: {
        x: 320,
        y: 400,
        size: 100
    },
    tongue: {
        x: undefined,
        y: 380,
        size: 20,
        speed: 20,
        state: "idle"
    }
};

// Array to hold multiple fireflies
let fireflies = [];
let numFireflies = 5;

// Score variable to track how many fireflies have been caught
let score = 0;

// Variable to track day or night mode
let isDayTime = false;

/**
 * Creates the canvas and initializes the fireflies
 */
function setup() {
    createCanvas(640, 480);
    for (let i = 0; i < numFireflies; i++) {
        resetFirefly(i);
    }
}

function draw() {
    if (gameState === "title") {
        drawTitleScreen();
    } else if (gameState === "playing") {
        background(isDayTime ? "#87CEEB" : "#191970");
        drawWater();
        moveFireflies();
        drawFireflies();
        moveFrogAndLilyPad();
        moveTongue();
        drawFrogAndLilyPad();
        checkTongueFireflyOverlap();
        displayScore();

        // End game when score reaches 20
        if (score >= 20) {
            gameState = "end";
        }
    } else if (gameState === "end") {
        drawEndScreen();
    }
}

/**
 * Draws the title screen with game title and instructions
 */
function drawTitleScreen() {
    background("#87CEEB");
    textAlign(CENTER, CENTER);
    fill("#FFFFFF");
    textSize(48);
    text("Fly Catching", width / 2, height / 2 - 50);

    textSize(24);
    text("Left Click to stick tongue out", width / 2, height / 2 + 20);
    text("Spacebar to switch day/night", width / 2, height / 2 + 60);
    text("Press any key to start", width / 2, height / 2 + 120);
}

/**
 * Draws the end screen when the game is over
 */
function drawEndScreen() {
    background("#FF6347");
    textAlign(CENTER, CENTER);
    fill("#FFFFFF");
    textSize(32);
    text("Congrats! You've eaten all the fireflies fatty!", width / 2, height / 2 - 40);
    text("That's called extinction!", width / 2, height / 2);
    textSize(24);
    text("Press any key to restart", width / 2, height / 2 + 40);
}

/**
 * Draws the water as a consistent wavy pattern
 */
function drawWater() {
    push();
    noStroke();
    fill(0, 191, 255, 150);

    // Draw multiple consistent sine waves across the canvas
    for (let y = 400; y < height; y += 10) {
        beginShape();
        for (let x = 0; x <= width; x += 10) {
            let offset = sin((x * 0.05) + frameCount * 0.05) * 5;
            vertex(x, y + offset);
        }
        vertex(width, height);
        vertex(0, height);
        endShape(CLOSE);
    }
    pop();
}

/**
 * Moves each firefly with some random backward movement but trending rightward
 */
function moveFireflies() {
    for (let firefly of fireflies) {
        if (!firefly.isCaught) {
            // Occasionally switch direction with a smaller chance
            // Reduced chance to change direction
            if (random() < 0.02) {
                firefly.direction *= -1;
            }

            // Move the firefly based on its current direction
            firefly.x += firefly.speed * firefly.direction;

            // Apply a wobble effect in the vertical direction
            firefly.y += sin(firefly.angle) * 2;
            firefly.angle += 0.05;

            // If moving left and reaching the left boundary, switch to moving right
            if (firefly.x < 0) {
                firefly.direction = 1;
            }

            // If the firefly has reached the right side of the canvas, reset it
            if (firefly.x > width) {
                resetFirefly(fireflies.indexOf(firefly));
            }
        }
    }
}

/**
 * Draws all fireflies with a glowing effect if it's night
 */
function drawFireflies() {
    for (let firefly of fireflies) {
        if (firefly.isCaught) {
            firefly.x = frog.tongue.x;
            firefly.y = frog.tongue.y;
        }

        push();
        noStroke();

        // If it's nighttime, add glow, else, draw without it
        if (!isDayTime) {
            fill(173, 255, 47, 100);
            ellipse(firefly.x, firefly.y, firefly.size * 3);
        }

        fill(isDayTime ? "#000000" : "#ADFF2F");
        ellipse(firefly.x, firefly.y, firefly.size);
        pop();
    }
}

/**
 * Resets a specific firefly to the left with a random y and resets its wobble angle
 */
function resetFirefly(index) {
    fireflies[index] = {
        x: 0,
        y: random(50, 300),
        size: 10,
        speed: 3,
        angle: random(0, TWO_PI),
        isCaught: false,
        direction: 1
    };
}

/**
 * Moves the frog and the lily pad to the mouse position on x
 */
function moveFrogAndLilyPad() {
    frog.body.x = mouseX;
    frog.tongue.x = frog.body.x;
}

/**
 * allows you to move the tongue based on its state
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
            for (let firefly of fireflies) {
                if (firefly.isCaught) {
                    resetFirefly(fireflies.indexOf(firefly));
                }
            }
        }
    }
}

/**
 * Draws the frog sitting on a lily pad with eyes, legs, and a water effect
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
 * Checks if the tongue overlaps any firefly
 */
function checkTongueFireflyOverlap() {
    for (let firefly of fireflies) {
        const d = dist(frog.tongue.x, frog.tongue.y, firefly.x, firefly.y);
        const eaten = (d < frog.tongue.size / 2 + firefly.size / 2);
        if (eaten && !firefly.isCaught) {
            firefly.isCaught = true;
            frog.tongue.state = "inbound";
            score++;
        }
    }
}

/**
 * Launch the tongue on click
 */
function mousePressed() {
    if (gameState === "playing" && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

/**
 * allows you to start/restart the game and toggle day/night using keys
 */
function keyPressed() {
    if (gameState === "title") {
        gameState = "playing";
    } else if (gameState === "playing") {
        if (key === ' ') {
            isDayTime = !isDayTime;
        }
    } else if (gameState === "end") {
        // Reset the game when any key is pressed
        score = 0;
        gameState = "title";
        fireflies = [];
        for (let i = 0; i < numFireflies; i++) {
            resetFirefly(i);
        }
    }
}

/**
 * Creates the score counter
 */
function displayScore() {
    push();
    fill(255);
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Score: ${score}`, 10, 10);
    pop();
}
/**
 * Draws the title screen with game title and instructions
 */
function drawTitleScreen() {
    background("#87CEEB");
    textAlign(CENTER, CENTER);
    fill("#FFFFFF");
    textSize(48);
    text("Fly Catching", width / 2, height / 2 - 50);

    textSize(24);
    text("Left Click to stick tongue out", width / 2, height / 2 + 20);
    text("Spacebar to switch day/night", width / 2, height / 2 + 60);
    text("Press any key to start", width / 2, height / 2 + 120);
    text("Eat 20 flies to win", width / 2, height / 2 + 160);
}
